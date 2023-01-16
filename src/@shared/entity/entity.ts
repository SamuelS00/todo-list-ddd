/* eslint-disable @typescript-eslint/consistent-type-assertions */
import UniqueEntityId from '../value-object/unique-entity-id.vo'

export default abstract class Entity<T = any> {
  public readonly uniqueEntityId: UniqueEntityId

  constructor (public readonly props: T, id?: UniqueEntityId) {
    this.uniqueEntityId = id ?? new UniqueEntityId()
  }

  get id (): string {
    return this.uniqueEntityId.value
  }

  toJSON (): Required<{ id: string } & T> {
    return {
      id: this.id,
      ...this.props
    } as Required<{ id: string } & T>
  }
}
