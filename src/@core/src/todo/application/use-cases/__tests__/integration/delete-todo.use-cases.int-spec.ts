import { NotFoundError } from '../../../../../@shared/domain/errors/not-found-error'
import { DeleteTodoUseCase } from '../../delete-todo.use-cases'
import { TodoSequelize } from '#todo/infrastructure/db/sequelize/todo-sequelize'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'

const { TodoModel, TodoSequelizeRepository } = TodoSequelize

describe('DeleteTodoUseCase Integration Tests', () => {
  let repository = new TodoSequelizeRepository(TodoModel)
  let useCase: DeleteTodoUseCase.UseCase

  setupSequelize({ models: [TodoModel] })

  beforeEach(() => {
    repository = new TodoSequelizeRepository(TodoModel)
    useCase = new DeleteTodoUseCase.UseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(async () => { await useCase.execute({ id: 'fake-id' }) }).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should delete a todo', async () => {
    const model = await TodoModel.factory().create()

    await useCase.execute({
      id: model.id
    })

    const noHasModel = await TodoModel.findByPk(model.id)

    expect(noHasModel).toBeNull()
  })
})
