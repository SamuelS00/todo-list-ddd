import { UniqueEntityId } from '#shared/domain/value-object/unique-entity-id.vo'
import { LoadEntityError } from '#shared/domain/errors/load-entity.error'
import { Todo } from '#todo/domain/entities/todo'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'
import { TodoSequelize } from '../todo-sequelize'

const { TodoModel, TodoModelMapper } = TodoSequelize

describe('TodoMapper Integration Test', () => {
  setupSequelize({ models: [TodoModel] })

  it('should throw error when todo is invalid', async () => {
    const model = TodoModel.build({
      id: '312cffad-1938-489e-a706-643dc9a3cfd3'
    } as any)

    try {
      TodoModelMapper.toEntity(model)
      fail('The todo has not throw a LoadEntityError')
    } catch (err) {
      expect(err).toBeInstanceOf(LoadEntityError)
      expect(err.error).toMatchObject({
        title: [
          'title should not be empty',
          'title must be a string',
          'title must be longer than or equal to 3 characters',
          'title must be shorter than or equal to 40 characters'
        ]
      })
    }
  })

  it('should throw a generic error', () => {
    const error = new Error('Generic Error')
    const spyValidate = jest
      .spyOn(Todo, 'validate')
      .mockImplementation(() => { throw error })

    const model = TodoModel.build({
      id: '312cffad-1938-489e-a706-643dc9a3cfd3'
    } as any)

    expect(() => TodoModelMapper.toEntity(model)).toThrow(error)
    expect(spyValidate).toHaveBeenCalled()
    spyValidate.mockRestore()
  })

  it('should convert a todo model to a todo entity', () => {
    const createdAt = new Date()
    const model = TodoModel.build({
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      title: 'Supermarket',
      priority: 'low',
      description: 'some description',
      is_scratched: false,
      created_at: createdAt
    })

    const entity = TodoModelMapper.toEntity(model)
    expect(entity.toJSON()).toStrictEqual(
      new Todo(
        {
          title: 'Supermarket',
          priority: 'low',
          description: 'some description',
          is_scratched: false,
          created_at: createdAt
        },
        new UniqueEntityId('5490020a-e866-4229-9adc-aa44b83234c4')
      ).toJSON()
    )
  })
})
