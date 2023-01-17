import { RepositoryInterface } from '@shared/domain/repository/repository-contracts'
import { Todo } from '../entities/todo'

export default interface TodoRepository
  extends RepositoryInterface<Todo> { }
