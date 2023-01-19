/* eslint-disable @typescript-eslint/dot-notation */

import { Todo } from '#todo/domain/entities/todo'
import TodoInMemoryRepository from './todo-in-memory.repository'

describe('TodoInMemoryRepository', () => {
  let repository: TodoInMemoryRepository

  beforeEach(() => (repository = new TodoInMemoryRepository()))
  it('should no filter items when filter object is null', async () => {
    const items = [new Todo({ title: 'test', priority: 'low' })]
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await repository['applyFilter'](items, null as any)
    expect(filterSpy).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(items)
  })

  it('should filter items using filter parameter', async () => {
    const items = [
      new Todo({ title: 'test', priority: 'low' }),
      new Todo({ title: 'TEST', priority: 'low' }),
      new Todo({ title: 'fake', priority: 'low' })
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
        priority: 'low',
        created_at: createdAt
      }),
      new Todo({
        title: 'TEST',
        priority: 'low',
        created_at: new Date(createdAt.getTime() + 100)
      }),
      new Todo({
        title: 'fake',
        priority: 'low',
        created_at: new Date(createdAt.getTime() + 200)
      })
    ]

    const itemsSorted = await repository['applySort'](items, null, null)
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('should sort by title', async () => {
    const items = [
      new Todo({ title: 'caa', priority: 'low' }),
      new Todo({ title: 'baa', priority: 'low' }),
      new Todo({ title: 'aaa', priority: 'low' })
    ]

    let itemsSorted = await repository['applySort'](items, 'title', 'asc')
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])

    itemsSorted = await repository['applySort'](items, 'title', 'desc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })
})
