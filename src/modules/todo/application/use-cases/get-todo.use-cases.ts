import { TodoRepository } from '../../domain/repository/todo.repository'
import { TodoOutput } from '../dtos/todo-output.dto'
import UseCase from '../../../../@shared/application/use-cases/use-case'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'

export default class GetTodoUseCase implements UseCase<Input, Output> {
  constructor (private readonly todoRepo: TodoRepository.Repository) { }

  async execute (input: Input): Promise<Output> {
    const entity = await this.todoRepo.findById(input.id)

    return TodoOutputMapper.toOutput(entity)
  }
}

export interface Input {
  id: string
}

export interface Output extends TodoOutput {}
