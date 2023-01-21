/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/naming-convention */

import { TodoRepository } from '../../../domain/repository/todo.repository'
import { Todo } from '../../../domain/entities/todo'
import { SortDirection } from '../../../../@shared/domain/repository/repository-contracts'
import { InMemorySearchableRepository } from '../../../../@shared/domain/repository/in-memory-searchable-repository'

export class TodoInMemoryRepository
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
      ? await super.applySort(items, 'created_at', 'desc')
      : await super.applySort(items, sort, sort_dir)
  }
}

export default TodoInMemoryRepository
