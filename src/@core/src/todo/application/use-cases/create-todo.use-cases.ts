/* eslint-disable @typescript-eslint/no-namespace */

import { UseCase as DefaultUseCase } from '../../../@shared/application/use-cases/use-case'
import { TodoOutput } from '../dtos/todo-output.dto'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'
import { Todo } from '../../domain/entities/todo'
import { TodoRepository } from '../../domain/repository/todo.repository'
import { PriorityType } from '../../domain/entities/priority-type.vo'

export namespace CreateTodoUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor (private readonly todoRepo: TodoRepository.Repository) { }

    async execute (input: Input): Promise<Output> {
      let entity: Todo

      if (input.priority !== undefined) {
        const priority = PriorityType.createByCode(input.priority)

        entity = new Todo({
          ...input,
          priority
        })
      } else {
        entity = new Todo({
          ...input,
          priority: undefined
        })
      }

      await this.todoRepo.insert(entity)

      return TodoOutputMapper.toOutput(entity)
    }
  }

  export interface Input {
    title: string
    description?: string
    priority?: number
    is_scratched?: boolean
  }

  export interface Output extends TodoOutput {}
}

export default CreateTodoUseCase
