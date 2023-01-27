/* eslint-disable @typescript-eslint/dot-notation */
import { EntityValidationError } from '#shared/domain'
import { UniqueEntityId } from '../../../@shared/domain/value-object/unique-entity-id.vo'
import { Todo, TodoProperties } from './todo'

describe('Todo Unit Tests', () => {
  test('constructor of todo', () => {
    const createdAt = new Date()

    let todo = new Todo({
      title: 'Supermarket',
      priority: 'medium',
      created_at: createdAt
    })
    expect(todo.props).toStrictEqual({
      title: 'Supermarket',
      description: null,
      priority: 'medium',
      created_at: createdAt,
      is_scratched: false
    })

    todo = new Todo({
      title: 'Clean house',
      priority: 'low'
    })
    expect(todo.created_at).toBeInstanceOf(Date)
    expect(todo.is_scratched).toBeFalsy()

    todo = new Todo({
      title: 'Clean house',
      priority: 'low',
      is_scratched: true
    })
    expect(todo).toBeTruthy()

    todo = new Todo({
      title: 'Summarize book chapter',
      description: 'Summary of the book such, chapter 3.',
      priority: 'low',
      is_scratched: true,
      created_at: createdAt
    })
    expect(todo.description).toBe('Summary of the book such, chapter 3.')
  })

  it('should have an id', () => {
    interface TodoData {
      props: TodoProperties
      id?: UniqueEntityId
    }

    const props: TodoProperties = {
      title: 'Supermarket',
      priority: 'medium'
    }

    const data: TodoData[] = [
      { props },
      { props, id: null as any },
      { props, id: undefined },
      { props, id: new UniqueEntityId() }
    ]

    data.forEach((i: TodoData) => {
      const todo = new Todo(i.props, i.id)

      expect(todo.id).not.toBeNull()
      expect(todo.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    })
  })

  test('getter and setter of name and priority prop', () => {
    const todo = new Todo({ title: 'supermarket', priority: 'low' })
    expect(todo.title).toBe('supermarket')
    expect(todo.priority).toBe('low')

    todo['title'] = 'Supermarket'
    expect(todo.title).toBe('Supermarket')
    expect(todo.priority).toBe('low')
  })

  test('getter and setter of description prop', () => {
    const changeDescription = (todo: Todo, data: any): void =>
      (todo['description'] = data)

    const inputs = [
      { value: undefined, expected: null },
      { value: null, expected: null },
      { value: 'some description', expected: 'some description' },
      {
        value: undefined,
        change: (todo: Todo) => {
          changeDescription(todo, 'other description')
        },
        expected: 'other description'
      },
      {
        value: 'some description',
        change: (todo: Todo) => {
          changeDescription(todo, undefined)
        },
        expected: null
      },
      {
        value: 'some description',
        change: (todo: Todo) => {
          changeDescription(todo, null)
        },
        expected: null
      }
    ] as any[]

    inputs.forEach(({ value, change, expected }) => {
      const todo = new Todo({
        title: 'Supermarket',
        priority: 'low',
        description: value
      })

      if (change !== undefined) {
        change(todo)
      }

      expect(todo.description).toBe(expected)
    })
  })

  test('getter and setter of is_active prop', () => {
    const inputs = [
      { value: undefined, expected: false },
      { value: null, expected: false },
      { value: true, expected: true },
      { value: false, expected: false }
    ]

    inputs.forEach(({ value, expected }) => {
      const todo = new Todo({
        title: 'supermarket',
        priority: 'low',
        is_scratched: value as any
      })
      expect(todo.is_scratched).toBe(expected)
    })
  })

  test('getter of created_at prop', () => {
    let todo = new Todo({
      title: 'supermarket',
      priority: 'low'
    })

    expect(todo.created_at).toBeInstanceOf(Date)

    const createdAt = new Date()

    todo = new Todo({
      title: 'supermarket',
      priority: 'low',
      created_at: createdAt
    })
    expect(todo.created_at).toBe(createdAt)
  })

  it('should update the todo transforming description to null when it is undefined', () => {
    const todo = new Todo({ title: 'supermarket', priority: 'low' })

    todo.changeDescription(undefined as any)
    expect(todo.title).toBe('supermarket')
    expect(todo.description).toBeNull()
  })

  it('should throw an error update with a invalid title', () => {
    const invalidNames = [undefined, null, 0, '']

    const todo = new Todo({ title: 'supermarket', priority: 'low' })

    invalidNames.forEach((invalidName: any) => {
      expect(() => {
        todo.changeTitle(invalidName)
      }).toThrow(EntityValidationError)
    })
  })

  it('should change title attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      priority: 'medium'
    })

    expect(todo.title).toBe('Supermarket')

    todo.changeTitle('Other title')
    expect(todo.title).toBe('Other title')
  })

  it('should throw an error update with a invalid description', () => {
    const invalidDescriptions = [0, '']

    const todo = new Todo({
      title: 'supermarket',
      priority: 'low',
      description: 'Pay with debit card'
    })

    invalidDescriptions.forEach((invalidDescription: any) => {
      expect(() => {
        todo.changeDescription(invalidDescription)
      }).toThrow(EntityValidationError)
    })
  })

  it('should change description attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      priority: 'medium',
      description: 'Get mayonnaise and coffee'
    })

    expect(todo.description).toBe('Get mayonnaise and coffee')

    todo.changeDescription('Other description')
    expect(todo.description).toBe('Other description')
  })

  it('should completed task is_scratched attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      priority: 'medium',
      description: 'Get mayonnaise and coffee',
      is_scratched: false
    })

    todo.completeTask()
    expect(todo.is_scratched).toBeTruthy()
  })

  it('should reactivate task is_scratched attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      priority: 'medium',
      description: 'Get mayonnaise and coffee',
      is_scratched: true
    })

    todo.reactivateTask()
    expect(todo.is_scratched).toBeFalsy()
  })
})
