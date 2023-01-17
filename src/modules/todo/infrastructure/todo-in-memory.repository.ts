import { InMemoryRepository } from '../../../@shared/domain/repository/in-memory-repository'
import { Todo } from '../domain/entities/todo'
import TodoRepository from '../domain/repository/todo.repository'

export default class TodoInMemoryRepository
  extends InMemoryRepository<Todo>
  implements TodoRepository {
}
