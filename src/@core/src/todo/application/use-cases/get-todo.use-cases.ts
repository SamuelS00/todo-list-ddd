/* eslint-disable @typescript-eslint/no-namespace */

import { UseCase as DefaultUseCase } from '../../../@shared/application/use-cases/use-case'
import { TodoOutput } from '../dtos/todo-output.dto'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'
import { TodoRepository } from '../../domain/repository/todo.repository'

export namespace GetTodoUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
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
}

export default GetTodoUseCase
