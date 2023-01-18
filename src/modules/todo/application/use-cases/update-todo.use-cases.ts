import { TodoRepository } from '../../domain/repository/todo.repository'
import { TodoOutput } from '../dtos/todo-output.dto'
import UseCase from '../../../../@shared/application/use-cases/use-case'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'

export default class UpdateTitleTodoUseCase implements UseCase<Input, Output> {
  constructor (private readonly todoRepo: TodoRepository.Repository) { }

  async execute (input: Input): Promise<Output> {
    const entity = await this.todoRepo.findById(input.id)

    entity.changeTitle(input.title)
    entity.changeDescription(input.description as string)

    if (input.is_scratched === true) {
      entity.completeTask()
    }

    if (input.is_scratched === false) {
      entity.reactivateTask()
    }

    await this.todoRepo.update(entity)

    return TodoOutputMapper.toOutput(entity)
  }
}

export interface Input {
  id: string
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  is_scratched?: boolean
}

export interface Output extends TodoOutput {}
