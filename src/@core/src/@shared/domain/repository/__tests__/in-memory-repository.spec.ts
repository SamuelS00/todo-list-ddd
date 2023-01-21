import { Entity } from '../../entity/entity'
import { NotFoundError } from '../../errors/not-found-error'
import { UniqueEntityId } from '../../value-object/unique-entity-id.vo'
import { InMemoryRepository } from '../in-memory-repository'

interface StubEntityProps {
  name: string
  price: number
}

type StubEntityJsonProps = Required<{ id: string } & StubEntityProps>

class StubEntity extends Entity<StubEntityProps, StubEntityJsonProps> {
  toJSON (): StubEntityJsonProps {
    return {
      id: this.id.toString(),
      name: this.props.name,
      price: this.props.price
    }
  }
}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> { }

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository

  beforeEach(() => {
    repository = new StubInMemoryRepository()
  })

  it('should inserts a new entity', async () => {
    const entity = new StubEntity({
      name: 'name value',
      price: 5
    })

    await repository.insert(entity)
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON())
  })

  it('should throws error when entity not found', () => {
    const arrange = [
      { id: 'fake-id' },
      { id: new UniqueEntityId('22c7bbc8-b798-481e-b9fd-5bacd3c235c6') }
    ]

    arrange.forEach((i) => {
      void expect(repository.findById(i.id)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${i.id.toString()}`)
      )
    })
  })

  it('should finds a entity by id', async () => {
    const entity = new StubEntity({
      name: 'name value',
      price: 5
    })

    await repository.insert(entity)

    let entityFound = await repository.findById(entity.id)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())

    entityFound = await repository.findById(entity.uniqueEntityId)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  it('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)

    const entities = await repository.findAll()

    expect(entities).toStrictEqual([entity])
  })

  it('should throws error on update when entity not found', () => {
    const entity = new StubEntity({
      name: 'name value',
      price: 5
    })

    void expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    )
  })

  it('should throws error on update when entity not found', () => {
    const entity = new StubEntity({
      name: 'name value',
      price: 5
    })

    void expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    )
  })

  it('should updates an entity', async () => {
    const entity = new StubEntity({
      name: 'name value',
      price: 5
    })

    await repository.insert(entity)

    const entityUpdated = new StubEntity({
      name: 'updated',
      price: 1
    }, entity.uniqueEntityId)

    await repository.update(entityUpdated)

    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON())
  })

  it('should throws error on delete when entity not found', () => {
    const arrange = [
      { id: 'fake-id' },
      { id: new UniqueEntityId('22c7bbc8-b798-481e-b9fd-5bacd3c235c6') }
    ]

    arrange.forEach((i) => {
      void expect(repository.delete(i.id)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${i.id.toString()}`)
      )
    })
  })

  it('should deletes an entity', async () => {
    const entity = new StubEntity({
      name: 'name value',
      price: 5
    })

    // insert and delete by passing the id
    await repository.insert(entity)
    await repository.delete(entity.id)
    expect(repository.items).toHaveLength(0)

    // insert and delete by passing the unique entity id
    await repository.insert(entity)
    await repository.delete(entity.uniqueEntityId)
    expect(repository.items).toHaveLength(0)
  })
})
