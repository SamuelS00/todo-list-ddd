import { CreateTodoUseCase } from '../../create-todo.use-cases'
import { TodoSequelize } from '#todo/infrastructure/db/sequelize/todo-sequelize'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'

const { TodoModel, TodoSequelizeRepository } = TodoSequelize

describe('CreateTodoUseCase Integration Tests', () => {
  let repository = new TodoSequelizeRepository(TodoModel)
  let useCase: CreateTodoUseCase.UseCase

  setupSequelize({ models: [TodoModel] })

  beforeEach(() => {
    repository = new TodoSequelizeRepository(TodoModel)
    useCase = new CreateTodoUseCase.UseCase(repository)
  })

  it('should create a todo', async () => {
    let output = await useCase.execute({
      title: 'Buy a Book',
      priority: 'high'
    })

    let entity = await repository.findById(output.id)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Buy a Book',
      description: 'Description not defined',
      priority: 'high',
      is_scratched: false,
      created_at: entity.created_at
    })

    output = await useCase.execute({
      title: 'Supermarket',
      priority: 'high',
      description: 'Get mayonnaise and coffee'
    })

    entity = await repository.findById(output.id)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      priority: 'high',
      is_scratched: false,
      created_at: entity.created_at
    })

    output = await useCase.execute({
      title: 'Supermarket',
      priority: 'high',
      description: 'Description not defined',
      is_scratched: false
    })

    entity = await repository.findById(output.id)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Supermarket',
      description: 'Description not defined',
      priority: 'high',
      is_scratched: false,
      created_at: entity.created_at
    })
  })
})
