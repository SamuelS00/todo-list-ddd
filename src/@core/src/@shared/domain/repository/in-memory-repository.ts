/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { Entity } from '../entity/entity'
import { NotFoundError } from '../errors/not-found-error'
import { UniqueEntityId } from '../value-object/unique-entity-id.vo'
import { RepositoryInterface } from '../repository/repository-contracts'

export abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
  items: E[] = []

  async insert (entity: E): Promise<void> {
    this.items.push(entity)
  }

  async bulkInsert (entities: E[]): Promise<void> {
    this.items.push(...entities)
  }

  async findById (id: string | UniqueEntityId): Promise<E> {
    const _id = `${id}`
    const item = await this._get(_id)
    return item
  }

  async findAll (): Promise<E[]> {
    return this.items
  }

  async update (entity: E): Promise<void> {
    await this._get(entity.id)
    const indexFound = this.items.findIndex(item => item.id === entity.id)
    this.items[indexFound] = entity
  }

  async delete (id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`
    await this._get(_id)
    const indexFound = this.items.findIndex(item => item.id === _id)
    this.items.splice(indexFound, 1)
  }

  protected async _get (id: string): Promise<E> {
    const _id = `${id}`
    const item = this.items.find(item => item.id === _id)

    if (item === undefined) {
      throw new NotFoundError(`Entity Not Found using ID ${id}`)
    }

    return item
  }
}
