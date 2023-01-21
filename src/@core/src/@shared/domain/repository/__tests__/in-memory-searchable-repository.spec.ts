/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */

import { Entity } from '../../entity/entity'
import { InMemorySearchableRepository } from '../in-memory-searchable-repository'
import { SearchParams, SearchResult } from '../repository-contracts'

interface StubEntityProps {
  name: string
  price: number
}

type StubEntityJsonProps = Required<{ id: string } & StubEntityProps>

class StubEntity extends Entity<StubEntityProps, StubEntityJsonProps> {
  toJSON (): StubEntityJsonProps {
    return {
      id: this.id,
      name: this.props.name,
      price: this.props.price
    }
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter (
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (filter == null) {
      return items
    }

    return items.filter((i) => {
      return (
        i.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.props.price.toString() === filter
      )
    })
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  let repository: StubInMemorySearchableRepository

  beforeEach(() => (repository = new StubInMemorySearchableRepository()))

  describe('applyFilter method', () => {
    it('should not filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 5 })]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      const filteredItems = await repository['applyFilter'](items, null)
      expect(filteredItems).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'fake', price: 0 })
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)

      let filteredItems = await repository['applyFilter'](items, 'TEST')
      expect(filteredItems).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      filteredItems = await repository['applyFilter'](items, '5')
      expect(filteredItems).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      filteredItems = await repository['applyFilter'](items, 'no-filter')
      expect(filteredItems).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort method', () => {
    it('should not sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 })
      ]
      let sortedItems = await repository['applySort'](items, null, null)
      expect(sortedItems).toStrictEqual(items)

      sortedItems = await repository['applySort'](items, 'price', 'asc')
      expect(sortedItems).toStrictEqual(items)
    })

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'c', price: 5 })
      ]
      let sortedItems = await repository['applySort'](items, 'name', 'asc')
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]])

      sortedItems = await repository['applySort'](items, 'name', 'desc')
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]])
    })
  })

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 5 }),
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'c', price: 5 }),
        new StubEntity({ name: 'd', price: 5 }),
        new StubEntity({ name: 'e', price: 5 })
      ]

      let paginatedItems = await repository['applyPaginate'](items, 1, 2)
      expect(paginatedItems).toStrictEqual([items[0], items[1]])

      paginatedItems = await repository['applyPaginate'](items, 2, 2)
      expect(paginatedItems).toStrictEqual([items[2], items[3]])

      paginatedItems = await repository['applyPaginate'](items, 3, 2)
      expect(paginatedItems).toStrictEqual([items[4]])

      paginatedItems = await repository['applyPaginate'](items, 4, 2)
      expect(paginatedItems).toStrictEqual([])
    })
  })

  describe('search method', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', price: 1 })
      const items = Array(16).fill(entity)
      repository.items = items

      const result = await repository.search(new SearchParams())
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null
        })
      )
    })

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }), // 0
        new StubEntity({ name: 'a', price: 5 }), // 1
        new StubEntity({ name: 'TEST', price: 5 }), // 2
        new StubEntity({ name: 'TeST', price: 5 }) // 3
      ]
      repository.items = items

      const result = await repository.search(
        new SearchParams({
          filter: 'TEST',
          page: 1,
          per_page: 2
        })
      )
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST'
        })
      )
    })

    describe('should apply paginate and sort', () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }), // 0
        new StubEntity({ name: 'a', price: 5 }), // 1
        new StubEntity({ name: 'd', price: 5 }), // 2
        new StubEntity({ name: 'e', price: 5 }), // 3
        new StubEntity({ name: 'c', price: 5 }) // 4
      ]

      beforeEach(() => (repository.items = items))

      const arrange = [
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc'
          }),
          search_result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null
          })
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc'
          }),
          search_result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: null
          })
        },
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc'
          }),
          search_result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null
          })
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc'
          }),
          search_result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
            filter: null
          })
        }
      ]

      test.each(arrange)(
        '%# when value is %j',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params)
          expect(result).toStrictEqual(search_result)
        }
      )
    })

    it('should search using filter, sort and paginate', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }), // 0
        new StubEntity({ name: 'a', price: 5 }), // 1
        new StubEntity({ name: 'TEST', price: 5 }), // 2
        new StubEntity({ name: 'e', price: 5 }), // 3
        new StubEntity({ name: 'TeSt', price: 5 }) // 4
      ]
      repository.items = items

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST'
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST'
          })
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST'
          }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: 'TEST'
          })
        }
      ]

      for (const i of arrange) {
        const result = await repository.search(i.params)
        expect(result).toStrictEqual(i.result)
      }
    })
  })
})
