/* eslint-disable @typescript-eslint/dot-notation */

import { TodoFakeBuilder } from '../../../domain/builders/todo-fake-builder'
import { Todo } from '../../../domain/entities/todo'
import { TodoInMemoryRepository } from './todo-in-memory.repository'

// TODO: refactor entities created via instance by the entity builder.
describe('TodoInMemoryRepository', () => {
  let repository: TodoInMemoryRepository

  beforeEach(() => (repository = new TodoInMemoryRepository()))
  it('should no filter items when filter object is null', async () => {
    const items = [
      TodoFakeBuilder.aTodo().build()
    ]
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await repository['applyFilter'](items, null as any)
    expect(filterSpy).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(items)
  })

  it('should filter items using filter parameter', async () => {
    const faker = TodoFakeBuilder.aTodo()

    const items = [
      faker.withTitle('test').build(),
      faker.withTitle('TEST').build(),
      faker.withTitle('fake').build()
    ]

    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await repository['applyFilter'](items, 'TEST')
    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
  })

  it('should sort by created_at when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      new Todo({
        title: 'test',
        created_at: createdAt
      }),
      new Todo({
        title: 'TEST',
        created_at: new Date(createdAt.getTime() + 100)
      }),
      new Todo({
        title: 'fake',
        created_at: new Date(createdAt.getTime() + 200)
      })
    ]

    const itemsSorted = await repository['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('should sort by title', async () => {
    const items = [
      new Todo({ title: 'caa' }),
      new Todo({ title: 'baa' }),
      new Todo({ title: 'aaa' })
    ]

    let itemsSorted = await repository['applySort'](items, 'title', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])

    itemsSorted = await repository['applySort'](items, 'title', 'desc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })
})
