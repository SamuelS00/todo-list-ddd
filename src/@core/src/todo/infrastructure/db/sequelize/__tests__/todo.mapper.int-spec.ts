import { UniqueEntityId } from '#shared/domain/value-object/unique-entity-id.vo'
import { Todo } from '#todo/domain/entities/todo'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'
import { TodoSequelize } from '../todo-sequelize'
import { PriorityType } from '#todo/domain/entities/priority-type.vo'
import { PriorityError } from '#todo/domain/errors/priority-type.error'

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
      expect(err).toBeInstanceOf(PriorityError)
      expect(err.message).toBe('code must be either 1 for low, 2 for medium or 3 for high')
    }
  })

  it('should throw a generic error', () => {
    const error = new Error('Generic Error')
    const spyValidate = jest
      .spyOn(Todo, 'validate')
      .mockImplementation(() => { throw error })

    const model = TodoModel.build({
      id: '312cffad-1938-489e-a706-643dc9a3cfd3',
      priority: 2
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
      priority: 2,
      description: 'some description',
      is_scratched: false,
      created_at: createdAt
    })

    const entity = TodoModelMapper.toEntity(model)
    expect(entity.toJSON()).toStrictEqual(
      new Todo(
        {
          title: 'Supermarket',
          priority: PriorityType.createByCode(2),
          description: 'some description',
          is_scratched: false,
          created_at: createdAt
        },
        new UniqueEntityId('5490020a-e866-4229-9adc-aa44b83234c4')
      ).toJSON()
    )
  })
})
