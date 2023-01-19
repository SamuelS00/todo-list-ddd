/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/naming-convention */

import { SortDirection } from '#shared/domain/repository/repository-contracts'
import { InMemorySearchableRepository } from '#shared/domain/repository/in-memory-searchable-repository'
import { Todo } from '#todo/domain/entities/todo'
import { TodoRepository } from '#todo/domain/repository/todo.repository'

export default class TodoInMemoryRepository
  extends InMemorySearchableRepository<Todo>
  implements TodoRepository.Repository {
  sortableFields: string[] = ['title', 'created_at']

  async exists (name: string): Promise<boolean> {
    return this.items.findIndex((item) => item.title === name) !== -1
  }

  protected async applyFilter (
    items: Todo[],
    filter: TodoRepository.Filter
  ): Promise<Todo[]> {
    if (!filter) {
      return items
    }

    return items.filter((i) => {
      return i.props.title.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort (
    items: Todo[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Todo[]> {
    return (sort == null)
      ? super.applySort(items, 'created_at', 'desc')
      : super.applySort(items, sort, sort_dir)
  }
}
