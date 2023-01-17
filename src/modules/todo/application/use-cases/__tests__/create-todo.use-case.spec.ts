import TodoInMemoryRepository from '../../../../../modules/todo/infrastructure/todo-in-memory.repository'
import CreateTodoUseCase from '../create-todo.use-cases'

describe('CreateTodoUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: CreateTodoUseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new CreateTodoUseCase(repository)
  })

  it('should create a todo', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    let output = await useCase.execute({
      title: 'Buy a Book',
      priority: 'high'
    })

    expect(output).toStrictEqual({
      id: repository.items[0].id,
      title: 'Buy a Book',
      description: 'Description not defined',
      priority: 'high',
      is_scratched: false,
      created_at: repository.items[0].created_at
    })
    expect(spyInsert).toHaveBeenCalledTimes(1)

    output = await useCase.execute({
      title: 'Supermarket',
      priority: 'high',
      description: 'Get mayonnaise and coffee'
    })

    expect(output).toStrictEqual({
      id: repository.items[1].id,
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      priority: 'high',
      is_scratched: false,
      created_at: repository.items[1].created_at
    })
    expect(spyInsert).toHaveBeenCalledTimes(2)
  })
})
