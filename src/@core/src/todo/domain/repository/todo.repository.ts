/* eslint-disable @typescript-eslint/no-namespace */

import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface
} from '../../../@shared/domain/repository/repository-contracts'
import { Todo } from '../entities/todo'

export namespace TodoRepository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Todo, Filter> {}

  export interface Repository extends SearchableRepositoryInterface<
  Todo,
  Filter,
  SearchParams,
  SearchResult
  > {
    exists: (name: string) => Promise<boolean>
  }
}
