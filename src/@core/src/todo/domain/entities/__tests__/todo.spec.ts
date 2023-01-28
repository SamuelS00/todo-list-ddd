/* eslint-disable @typescript-eslint/dot-notation */
import { EntityValidationError } from '#shared/domain'
import { UniqueEntityId } from '../../../../@shared/domain/value-object/unique-entity-id.vo'
import { PriorityType } from '../priority-type.vo'
import { Todo, TodoProperties } from '../todo'

describe('Todo Unit Tests', () => {
  test('constructor of todo', () => {
    const createdAt = new Date()
    const priorityMedium = PriorityType.createMedium()

    let todo = new Todo({
      title: 'Supermarket',
      priority: priorityMedium,
      created_at: createdAt
    })

    expect(todo.props).toStrictEqual({
      title: 'Supermarket',
      description: null,
      priority: priorityMedium,
      created_at: createdAt,
      is_scratched: false
    })

    todo = new Todo({
      title: 'Clean house',
      priority: priorityMedium
    })
    expect(todo.created_at).toBeInstanceOf(Date)
    expect(todo.priority).toBeInstanceOf(PriorityType)
    expect(todo.priority.description).toBe('Medium')
    expect(todo.is_scratched).toBeFalsy()

    todo = new Todo({
      title: 'Clean house',
      is_scratched: true
    })
    expect(todo).toBeTruthy()

    todo = new Todo({
      title: 'Summarize book chapter',
      description: 'Summary of the book such, chapter 3.',
      priority: priorityMedium,
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

    const props: TodoProperties = { title: 'Supermarket' }

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

  test('getter and setter of name prop', () => {
    const todo = new Todo({ title: 'supermarket' })
    expect(todo.title).toBe('supermarket')

    todo['title'] = 'Supermarket'
    expect(todo.title).toBe('Supermarket')
  })

  test('getter and setter of priority prop', () => {
    const priorityLow = PriorityType.createLow()
    const todo = new Todo({
      title: 'supermarket',
      priority: priorityLow
    })

    expect(todo.priority.description).toBe('Low')
    expect(todo.priority.code).toBe(1)
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
        is_scratched: value as any
      })
      expect(todo.is_scratched).toBe(expected)
    })
  })

  test('getter of created_at prop', () => {
    let todo = new Todo({ title: 'supermarket' })

    expect(todo.created_at).toBeInstanceOf(Date)

    const createdAt = new Date()

    todo = new Todo({
      title: 'supermarket',
      created_at: createdAt
    })
    expect(todo.created_at).toBe(createdAt)
  })

  it('should update the todo transforming description to null when it is undefined', () => {
    const todo = new Todo({ title: 'supermarket' })

    todo.changeDescription(undefined as any)
    expect(todo.title).toBe('supermarket')
    expect(todo.description).toBeNull()
  })

  it('should have a medium type priority by default when not passed', () => {
    const todo = new Todo({ title: 'Supermarket' })

    expect(todo.priority.description).toBe('Medium')
    expect(todo.priority.code).toBe(2)
  })

  it('should throw an error update with a invalid title', () => {
    const invalidNames = [undefined, null, 0, '']

    const todo = new Todo({ title: 'supermarket' })

    invalidNames.forEach((invalidName: any) => {
      expect(() => {
        todo.changeTitle(invalidName)
      }).toThrow(EntityValidationError)
    })
  })

  it('should change title attribute', () => {
    const todo = new Todo({ title: 'Supermarket' })

    expect(todo.title).toBe('Supermarket')

    todo.changeTitle('Other title')
    expect(todo.title).toBe('Other title')
  })

  it('should throw an error update with a invalid description', () => {
    const invalidDescriptions = [0, '']

    const todo = new Todo({
      title: 'supermarket',
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
      description: 'Get mayonnaise and coffee'
    })

    expect(todo.description).toBe('Get mayonnaise and coffee')

    todo.changeDescription('Other description')
    expect(todo.description).toBe('Other description')
  })

  it('should change priority attribute', () => {
    const priorityMedium = PriorityType.createByCode(2)

    const todo = new Todo({
      title: 'Supermarket',
      priority: PriorityType.createByCode(1)
    })

    todo.changePriority(priorityMedium)

    expect(todo.priority.description).toBe('Medium')
    expect(todo.priority.code).toBe(2)
  })

  it('should completed task is_scratched attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      is_scratched: false
    })

    todo.completeTask()
    expect(todo.is_scratched).toBeTruthy()
  })

  it('should reactivate task is_scratched attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      is_scratched: true
    })

    todo.reactivateTask()
    expect(todo.is_scratched).toBeFalsy()
  })
})
