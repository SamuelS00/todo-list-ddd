import { NotFoundError } from '../../../../../@shared/domain/errors/not-found-error'
import { GetTodoUseCase } from '../../get-todo.use-cases'
import { TodoSequelize } from '#todo/infrastructure/db/sequelize/todo-sequelize'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'

const { TodoModel, TodoSequelizeRepository } = TodoSequelize

describe('GetTodoUseCase Integration Tests', () => {
  let repository = new TodoSequelizeRepository(TodoModel)
  let useCase: GetTodoUseCase.UseCase

  setupSequelize({ models: [TodoModel] })

  beforeEach(() => {
    repository = new TodoSequelizeRepository(TodoModel)
    useCase = new GetTodoUseCase.UseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(async () => await useCase.execute({ id: 'fake-id' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should returns a todo', async () => {
    const model = await TodoModel.factory().create()
    const output = await useCase.execute({ id: model.id })

    expect(output).toStrictEqual({
      id: model.id,
      title: model.title,
      description: model.description,
      priority: model.priority,
      is_scratched: false,
      created_at: model.created_at
    })
  })
})
