/* eslint-disable @typescript-eslint/naming-convention */

import { InMemoryRepository } from './in-memory-repository'
import { Entity } from '../entity/entity'
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection
} from '../repository/repository-contracts'

export abstract class InMemorySearchableRepository<
    E extends Entity,
    Filter = string
  >
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, Filter> {
  sortableFields: string[] = []
  async search (props: SearchParams<Filter>): Promise<SearchResult<E, Filter>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter)

    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir
    )

    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page
    )

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter
    })
  }

  protected abstract applyFilter (
    items: E[],
    filter: Filter | null
  ): Promise<E[]>

  protected async applySort (
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<E[]> {
    if ((sort == null) || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === 'asc' ? -1 : 1
      }

      if (a.props[sort] > b.props[sort]) {
        return sort_dir === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  protected async applyPaginate (
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page']
  ): Promise<E[]> {
    const start = (page - 1) * per_page
    const limit = start + per_page

    return items.slice(start, limit)
  }
}
