import TodoRepository from '../../../../modules/todo/domain/repository/todo.repository'
import { TodoOutput } from '../dto/todo-output.dto'
import UseCase from '../../../../@shared/application/use-cases/use-case'

export default class GetTodoUseCase implements UseCase<Input, Output> {
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
