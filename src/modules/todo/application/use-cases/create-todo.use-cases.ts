import { TodoRepository } from '../../../../modules/todo/domain/repository/todo.repository'
import { Todo } from '../../../../modules/todo/domain/entities/todo'
import { TodoOutput } from '../dtos/todo-output.dto'
import UseCase from '../../../../@shared/application/use-cases/use-case'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'

export default class CreateTodoUseCase implements UseCase<Input, Output> {
  constructor (private readonly todoRepo: TodoRepository.Repository) { }

  async execute (input: Input): Promise<Output> {
    const entity = new Todo(input)
    await this.todoRepo.insert(entity)

    return TodoOutputMapper.toOutput(entity)
  }
}

export interface Input {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  is_scratched?: boolean
}

export interface Output extends TodoOutput {}
