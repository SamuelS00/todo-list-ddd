import UniqueEntityId from '../value-object/unique-entity-id.vo'

export abstract class Entity<Props = any, JsonProps = Required<{ id: string } & Props>> {
  public readonly uniqueEntityId: UniqueEntityId

  constructor (public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id ?? new UniqueEntityId()
  }

  get id (): string {
    return this.uniqueEntityId.value
  }

  abstract toJSON (): JsonProps
}

export default Entity
