/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Todo } from '../../domain/entities/todo'
import { TodoOutput } from '../dtos/todo-output.dto'

export class TodoOutputMapper {
  static toOutput (entity: Todo): TodoOutput {
    return entity.toJSON()
  }
}
