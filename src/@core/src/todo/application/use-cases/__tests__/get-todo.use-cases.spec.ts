import { Todo } from '../../../domain/entities/todo'
import { NotFoundError } from '../../../../@shared/domain/errors/not-found-error'
import TodoInMemoryRepository from '../../../infrastructure/db/in-memory/todo-in-memory.repository'
import { GetTodoUseCase } from '../get-todo.use-cases'

describe('GetTodoUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: GetTodoUseCase.UseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new GetTodoUseCase.UseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    void expect(async () => await useCase.execute({ id: 'fake-id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should returns a todo', async () => {
    const items = [
      new Todo({
        title: 'Buy a Book',
        priority: 'high',
        description: 'Description not defined'
      })
    ]

    repository.items = items

    const spyInsert = jest.spyOn(repository, 'findById')
    const output = await useCase.execute({ id: items[0].id })

    expect(output).toStrictEqual({
      id: repository.items[0].id,
      title: 'Buy a Book',
      description: 'Description not defined',
      priority: 'high',
      is_scratched: false,
      created_at: repository.items[0].created_at
    })
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })
})
