import TodoRepository from '../../../../modules/todo/domain/repository/todo.repository'
import { TodoOutput } from '../dto/todo-output.dto'

export default class GetTodoUseCase {
  constructor (private readonly todoRepo: TodoRepository) { }

  async execute (input: Input): Promise<Output> {
    const entity = await this.todoRepo.findById(input.id)

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
  id: string
}

export interface Output extends TodoOutput {}
