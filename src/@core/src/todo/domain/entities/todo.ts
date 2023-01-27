/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Entity } from '../../../@shared/domain/entity/entity'
import { UniqueEntityId } from '../../../@shared/domain/value-object/unique-entity-id.vo'
import { TodoValidatorFactory } from '../validators'
import { EntityValidationError } from '../../../@shared/domain/errors/invalid-validation-error'

export type Priority = 'low' | 'medium' | 'high'

export interface TodoProperties {
  title: string
  priority: Priority
  description?: string | null
  is_scratched?: boolean
  created_at?: Date
}

export type TodoPropsJson = Required<{ id: string } & TodoProperties>

export class Todo extends Entity<TodoProperties> {
  constructor (public readonly props: TodoProperties, id?: UniqueEntityId) {
    Todo.validate(props)
    super(props, id)
    this.description = this.props.description
    this.is_scratched = this.props.is_scratched
    this.created_at = this.props.created_at
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

  get description () {
    return this.props.description ?? null
  }

  private set description (value: any) {
    this.props.description = typeof value !== 'string'
      ? null
      : value
  }

  get priority (): string {
    return this.props.priority
  }

  get is_scratched (): boolean {
    return this.props.is_scratched as boolean
  }

  private set is_scratched (value: boolean | undefined) {
    this.props.is_scratched = value ?? false
  }

  get created_at (): Date {
    return this.props.created_at as Date
  }

  private set created_at (value: Date | undefined) {
    const date = value ?? new Date()
    this.props.created_at = date
  }

  toJSON (): TodoPropsJson {
    return {
      id: this.id.toString(),
      title: this.title,
      description: this.description,
      priority: this.priority as Priority,
      is_scratched: this.is_scratched,
      created_at: this.created_at
    }
  }
}

export default Todo
