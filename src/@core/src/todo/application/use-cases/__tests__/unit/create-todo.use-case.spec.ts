import { TodoInMemoryRepository } from '../../../../infrastructure/db/in-memory/todo-in-memory.repository'
import { CreateTodoUseCase } from '../../create-todo.use-cases'

describe('CreateTodoUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: CreateTodoUseCase.UseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new CreateTodoUseCase.UseCase(repository)
  })

  it('should create a todo', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')

    let output = await useCase.execute({
      title: 'Buy a Book'
    })

    expect(output).toStrictEqual({
      id: repository.items[0].id,
      title: 'Buy a Book',
      description: null,
      priority: 2,
      is_scratched: false,
      created_at: repository.items[0].created_at
    })
    expect(spyInsert).toHaveBeenCalledTimes(1)

    output = await useCase.execute({
      title: 'Supermarket',
      priority: 2,
      description: 'Get mayonnaise and coffee'
    })

    expect(output).toStrictEqual({
      id: repository.items[1].id,
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      priority: 2,
      is_scratched: false,
      created_at: repository.items[1].created_at
    })
    expect(spyInsert).toHaveBeenCalledTimes(2)
  })
})
