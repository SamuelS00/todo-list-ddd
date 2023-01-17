import Entity from '../../../../@shared/domain/entity/entity'
import UniqueEntityId from '../../../../@shared/domain/value-object/unique-entity-id.vo'
import TodoValidatorFactory from '../validators/todo.validator'
import { EntityValidationError } from '../../../../@shared/domain/errors/invalid-validation-error'

export type Priority = 'low' | 'medium' | 'high'

export interface TodoProperties {
  title: string
  description?: string
  priority: Priority
  created_at?: Date
  is_scratched?: boolean
}

export class Todo extends Entity<TodoProperties> {
  constructor (public readonly props: TodoProperties, id?: UniqueEntityId) {
    Todo.validate(props)
    super(props, id)
    this.props.description = this.description
    this.props.is_scratched = this.is_scratched ?? false
    this.props.created_at = this.created_at ?? new Date()
  }

  changeTitle (newTitle: string): void {
    Todo.validate({ ...this.props, title: newTitle })
    this.title = newTitle
  }

  changeDescription (newDescription: string): void {
    Todo.validate({ ...this.props, description: newDescription })
    this.description = newDescription
  }

  completeTask (): void {
    this.props.is_scratched = true
  }

  reactivateTask (): void {
    this.props.is_scratched = false
  }

  static validate (props: TodoProperties): void {
    const validator = TodoValidatorFactory.create()
    validator.validate(props)
    const isValid = validator.validate(props)

    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }

  get title (): string {
    return this.props.title
  }

  private set title (value: string) {
    this.props.title = value
  }

  get description (): string {
    return this.props.description ?? 'Description not defined'
  }

  private set description (value: string) {
    this.props.description = value
  }

  get is_scratched (): boolean | undefined {
    return this.props.is_scratched
  }

  get created_at (): Date | undefined {
    return this.props.created_at
  }
}
