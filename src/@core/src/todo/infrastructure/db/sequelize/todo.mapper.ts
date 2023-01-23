import { Todo } from '#todo/domain'
import { UniqueEntityId } from '#shared/domain/value-object/unique-entity-id.vo'
import {
  EntityValidationError,
  LoadEntityError
} from '#shared/domain/errors'
import { TodoModel } from './todo.model'

export const TodoModelMapper = {
  toEntity (model: TodoModel): Todo {
    const { id, ...otherData } = model.toJSON()

    try {
      return new Todo(otherData, new UniqueEntityId(id))
    } catch (err) {
      if (err instanceof EntityValidationError) {
        throw new LoadEntityError(err.error)
      }

      throw err
    }
  }
}

export default TodoModelMapper
