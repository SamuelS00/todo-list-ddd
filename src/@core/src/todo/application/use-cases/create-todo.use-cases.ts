/* eslint-disable @typescript-eslint/no-namespace */

import { UseCase as DefaultUseCase } from '../../../@shared/application/use-cases/use-case'
import { TodoOutput } from '../dtos/todo-output.dto'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'
import { Todo } from '../../domain/entities/todo'
import { TodoRepository } from '../../domain/repository/todo.repository'

export namespace CreateTodoUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
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
}

export default CreateTodoUseCase
