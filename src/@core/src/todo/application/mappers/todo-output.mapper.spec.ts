import { PriorityType } from '#todo/domain/entities/priority-type.vo'
import { Todo } from '../../domain/entities/todo'
import { TodoOutputMapper } from './todo-output.mapper'

describe('TodoOutputMapper Unit Tests', () => {
  it('should convert a todo in output', () => {
    const createdAt = new Date()

    const entity = new Todo({
      title: 'Supermarket',
      description: 'get juice, chicken and oils',
      priority: PriorityType.createByCode(1),
      created_at: createdAt
    })

    const spyToJSON = jest.spyOn(entity, 'toJSON')
    const output = TodoOutputMapper.toOutput(entity)

    expect(output).toStrictEqual({
      id: entity.id,
      title: 'Supermarket',
      description: 'get juice, chicken and oils',
      priority: 1,
      is_scratched: false,
      created_at: createdAt
    })
    expect(spyToJSON).toHaveBeenCalled()
  })
})
