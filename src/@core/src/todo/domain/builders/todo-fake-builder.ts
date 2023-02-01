/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Todo } from '../entities'
import {
  DataGenerator,
  DataGeneratorInterface
} from '../../../@shared/infrastructure/testing/helpers/data-generator'
import { PriorityType } from '../entities/priority-type.vo'
import { UniqueEntityId } from '../../../@shared/domain'

type PropOrFactory<T> = T | ((index: number) => T)

// test data builder
export class TodoFakeBuilder<TBuild = any> {
  private lib: DataGeneratorInterface<Chance.Chance>
  private readonly countObjs: number

  private _unique_entity_id: PropOrFactory<UniqueEntityId>

  private _title: PropOrFactory<string> = (index): string =>
    this.lib.word({ length: 5 })

  private _description: PropOrFactory<string | null> = (index): string =>
    this.lib.sentence()

  private _priority: PropOrFactory<PriorityType> = (index): PriorityType =>
    PriorityType.createByCode(this.lib.integer(1, 3))

  private _is_scratched: PropOrFactory<boolean> = (index) => false
  private _created_at: PropOrFactory<Date>

  static aTodo (): TodoFakeBuilder<Todo> {
    return new TodoFakeBuilder<Todo>()
  }

  static theTodos (countObjs: number): TodoFakeBuilder<Todo[]> {
    return new TodoFakeBuilder<Todo[]>(countObjs)
  }

  private constructor (countObjs = 1) {
    this.countObjs = countObjs
    this.lib = DataGenerator
  }

  withUniqueEntityId (valueOrFactory: PropOrFactory<UniqueEntityId>): this {
    this._unique_entity_id = valueOrFactory
    return this
  }

  withTitle (valueOrFactory: PropOrFactory<string>): this {
    this._title = valueOrFactory
    return this
  }

  withInvalidTitleEmpty (value: '' | null | undefined): this {
    this._title = value as any
    return this
  }

  withInvalidTitleNotAString (value: any = 5): this {
    this._title = value
    return this
  }

  withInvalidTitleTooLong (value?: string): this {
    this._title = value ?? DataGenerator.word({ length: 41 })
    return this
  }

  withDescription (valueOrFactory: PropOrFactory<string | null>): this {
    this._description = valueOrFactory
    return this
  }

  completeTask (): this {
    this._is_scratched = true
    return this
  }

  reactivateTask (): this {
    this._is_scratched = false
    return this
  }

  withInvalidDescriptionNotAString (value: any = 5): this {
    this._description = value
    return this
  }

  withPriority (valueOrFactory: PropOrFactory<PriorityType>): this {
    this._priority = valueOrFactory
    return this
  }

  withInvalidPriorityEmpty (value: '' | null | undefined): this {
    this._priority = value as any
    return this
  }

  withInvalidPriorityNotAPriorityType (value: any = 'fake priority type'): this {
    this._priority = value
    return this
  }

  withInvalidIsScratchedEmpty (value: '' | null | undefined): this {
    this._is_scratched = value as any
    return this
  }

  withInvalidIsScratchedNotABoolean (value: any = 'fake boolean'): this {
    this._is_scratched = value
    return this
  }

  withCreatedAt (valueOrFactory: PropOrFactory<Date>): this {
    this._created_at = valueOrFactory
    return this
  }

  build (): TBuild {
    const todos = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Todo(
          {
            title: this.callFactory(this._title, index),
            priority: this.callFactory(this._priority, index),
            description: this.callFactory(this._description, index),
            is_scratched: this.callFactory(this._is_scratched, index),
            ...(this._created_at && {
              created_at: this.callFactory(this._created_at, index)
            })
          },
          this._unique_entity_id &&
            this.callFactory(this._unique_entity_id, index)
        )
    )

    return this.countObjs === 1 ? (todos[0] as any) : todos
  }

  get unique_entity_id (): any {
    return this.getValue('unique_entity_id')
  }

  get title (): string {
    return this.getValue('title')
  }

  get priority (): PriorityType {
    return this.getValue('priority')
  }

  get description (): string {
    return this.getValue('description')
  }

  get is_scratched (): boolean {
    return this.getValue('is_scratched')
  }

  get created_at (): Date {
    return this.getValue('created_at')
  }

  private getValue (prop: string): any {
    const optional = ['unique_entity_id', 'created_at']
    const privateProp = `_${prop}`
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use 'with' method instead`
      )
    }
    return this.callFactory(this[privateProp], 0)
  }

  private callFactory (
    propOrFactory: PropOrFactory<any>,
    index: number
  ): PropOrFactory<any> {
    return typeof propOrFactory === 'function'
      ? propOrFactory(index)
      : propOrFactory
  }
}
