import { TodoRepository } from '../../domain/repository/todo.repository'
import UseCase from '@shared/application/use-cases/use-case'

export default class DeleteTodoUseCase implements UseCase<Input, void> {
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
