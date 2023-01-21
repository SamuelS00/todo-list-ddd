import { Todo } from '../../domain/entities/todo'
import { TodoOutput } from '../dtos/todo-output.dto'

export const TodoOutputMapper = {
  toOutput (entity: Todo): TodoOutput {
    return entity.toJSON()
  }
}
