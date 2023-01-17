import TodoRepository from '../../../../modules/todo/domain/repository/todo.repository'
import { Todo } from '../../../../modules/todo/domain/entities/todo'

export default class CreateTodoUseCase {
  constructor (private readonly todoRepo: TodoRepository) { }

  async execute (input: Input): Promise<Output> {
    const entity = new Todo(input)

    await this.todoRepo.insert(entity)

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      priority: entity.priority,
      is_scratched: entity.is_scratched,
      created_at: entity.created_at as Date
    }
  }
}

export interface Input {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  is_scratched?: boolean
}

export interface Output {
  id: string
  title: string
  description?: string | null
  priority: string
  is_scratched?: boolean
  created_at: Date
}
