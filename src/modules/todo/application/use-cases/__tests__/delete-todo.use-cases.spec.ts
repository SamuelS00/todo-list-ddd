import { Todo } from '#todo/domain/entities/todo'
import NotFoundError from '#shared/domain/errors/not-found-error'
import TodoInMemoryRepository from '#todo/infrastructure/db/in-memory/todo-in-memory.repository'
import DeleteTodoUseCase from '../delete-todo.use-cases'

describe('DeleteTodoUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: DeleteTodoUseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new DeleteTodoUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    void expect(async () => { await useCase.execute({ id: 'fake-id' }) }).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should delete a todo', async () => {
    const items = [
      new Todo({
        title: 'Buy a Book',
        priority: 'high',
        description: 'Description not defined'
      })
    ]

    repository.items = items

    const spyDelete = jest.spyOn(repository, 'delete')
    await useCase.execute({ id: items[0].id })

    expect(repository.items).toHaveLength(0)
    expect(spyDelete).toHaveBeenCalledTimes(1)
  })
})
