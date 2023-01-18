import UniqueEntityId from '../value-object/unique-entity-id.vo'
import Entity from './entity'
import { validate as uuidValidate } from 'uuid'

class StubEntity extends Entity<{ team_name: string, team_stadium: string }> {
  toJSON (): Required<{ id: string } & { team_name: string, team_stadium: string }> {
    return {
      id: this.id,
      team_name: this.props.team_name,
      team_stadium: this.props.team_stadium
    }
  }
}

describe('Entity Unit Tests', () => {
  it('should set props and id', () => {
    const arrange = { team_name: 'vice da gama', team_stadium: 'são januário' }
    const entity = new StubEntity(arrange)

    expect(entity.props).toStrictEqual(arrange)
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).not.toBeNull()
    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('should accept a valid uuid', () => {
    const arrange = { team_name: 'vice da gama', team_stadium: 'são januário' }
    const uniqueEntityId = new UniqueEntityId()
    const entity = new StubEntity(arrange, uniqueEntityId)

    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).toBe(uniqueEntityId.value)
  })

  it('should convert a entity to a JavaScript Object', () => {
    const arrange = { team_name: 'vice da gama', team_stadium: 'são januário' }
    const uniqueEntityId = new UniqueEntityId()
    const entity = new StubEntity(arrange, uniqueEntityId)

    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange
    })
  })
})
