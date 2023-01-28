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
      priority: 1
    })

    let entity = await repository.findById(output.id)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Buy a Book',
      description: null,
      priority: 1,
      is_scratched: false,
      created_at: entity.created_at
    })
    expect(entity.priority.description).toBe('Low')
    expect(entity.priority.code).toBe(1)

    output = await useCase.execute({
      title: 'Supermarket',
      priority: 2,
      description: 'Get mayonnaise and coffee'
    })

    entity = await repository.findById(output.id)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      priority: 2,
      is_scratched: false,
      created_at: entity.created_at
    })
    expect(entity.priority.description).toBe('Medium')
    expect(entity.priority.code).toBe(2)

    output = await useCase.execute({
      title: 'Supermarket',
      priority: 3,
      is_scratched: false
    })

    entity = await repository.findById(output.id)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Supermarket',
      description: null,
      priority: 3,
      is_scratched: false,
      created_at: entity.created_at
    })
    expect(entity.priority.description).toBe('High')
    expect(entity.priority.code).toBe(3)
  })
})
