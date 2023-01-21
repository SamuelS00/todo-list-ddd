/* eslint-disable @typescript-eslint/no-namespace */

import { UseCase as DefaultUseCase } from '../../../@shared/application/use-cases/use-case'
import { TodoRepository } from '../../domain/repository/todo.repository'

export namespace DeleteTodoUseCase {
  export class UseCase implements DefaultUseCase<Input, void> {
    constructor (private readonly todoRepo: TodoRepository.Repository) {}

    async execute (input: Input): Promise<void> {
      const entity = await this.todoRepo.findById(input.id)
      await this.todoRepo.delete(entity.id)
    }
  }

  export interface Input {
    id: string
  }

  // type Output = void
}

export default DefaultUseCase
