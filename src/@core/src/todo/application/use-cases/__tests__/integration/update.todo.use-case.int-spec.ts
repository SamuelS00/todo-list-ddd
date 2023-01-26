import { NotFoundError } from '../../../../../@shared/domain/errors/not-found-error'
import { UpdateTodoUseCase } from '../../update-todo.use-cases'
import { TodoSequelize } from '#todo/infrastructure/db/sequelize/todo-sequelize'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'

const { TodoModel, TodoSequelizeRepository } = TodoSequelize

describe('UpdateTodoUseCase Integration Tests', () => {
  let repository = new TodoSequelizeRepository(TodoModel)
  let useCase: UpdateTodoUseCase.UseCase

  setupSequelize({ models: [TodoModel] })

  beforeEach(() => {
    repository = new TodoSequelizeRepository(TodoModel)
    useCase = new UpdateTodoUseCase.UseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    await expect(async () => await useCase.execute({ id: 'fake-id', title: 'fake' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should update a todo', async () => {
    const model = await TodoModel.factory().create()

    let output = await useCase.execute({
      id: model.id,
      title: 'supermarket'
    })

    expect(output).toStrictEqual({
      id: model.id,
      title: 'supermarket',
      description: model.description,
      priority: model.priority,
      is_scratched: false,
      created_at: model.created_at
    })

    interface Arrange {
      input: {
        id: string
        title: string
        priority?: string
        description?: null | string
        is_scratched?: boolean
      }
      expected: {
        id: string
        title: string
        description: null | string
        priority?: string
        is_scratched: boolean
        created_at: Date
      }
    }

    const arrange: Arrange[] = [
      {
        input: {
          id: model.id,
          title: 'test',
          description: 'some description'
        },
        expected: {
          id: model.id,
          title: 'test',
          description: 'some description',
          priority: model.priority,
          is_scratched: false,
          created_at: model.created_at
        }
      },
      {
        input: {
          id: model.id,
          title: 'test',
          description: model.description
        },
        expected: {
          id: model.id,
          title: 'test',
          description: model.description,
          priority: model.priority,
          is_scratched: false,
          created_at: model.created_at
        }
      },
      {
        input: {
          id: model.id,
          title: 'test',
          is_scratched: true
        },
        expected: {
          id: model.id,
          title: 'test',
          description: model.description,
          priority: model.priority,
          is_scratched: true,
          created_at: model.created_at
        }
      }
    ]

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        title: i.input.title,
        description: i.input.description as string,
        is_scratched: i.input.is_scratched
      })
      expect(output).toStrictEqual({
        id: model.id,
        title: i.expected.title,
        description: i.expected.description,
        priority: i.expected.priority,
        is_scratched: i.expected.is_scratched,
        created_at: i.expected.created_at
      })
    }
  })
})
