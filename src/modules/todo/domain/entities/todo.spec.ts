import UniqueEntityId from '@shared/domain/value-object/unique-entity-id.vo'
import { Todo, TodoProperties } from './todo'

describe('Todo Unit Tests', () => {
  beforeEach(() => {
    Todo.validate = jest.fn()
  })

  it('constructor of todo', () => {
    const createdAt = new Date()

    let todo = new Todo({
      title: 'Supermarket',
      priority: 'medium',
      created_at: createdAt
    })
    expect(todo.props).toStrictEqual({
      title: 'Supermarket',
      description: 'Description not defined',
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
    expect(Todo.validate).toHaveBeenCalled()
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
      { props, id: undefined },
      { props, id: new UniqueEntityId() }
    ]

    data.forEach((i: TodoData) => {
      const todo = new Todo(i.props, i.id as any)

      expect(todo.id).not.toBeNull()
      expect(todo.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    })
  })

  it('getter of the props', () => {
    const createdAt = new Date()

    const todo: TodoProperties = {
      title: 'Supermarket',
      description: 'Get mayonnaise and coffee',
      priority: 'medium',
      created_at: createdAt
    }

    expect(todo.title).toBe('Supermarket')
    expect(todo.description).toBe('Get mayonnaise and coffee')
    expect(todo.priority).toBe('medium')
    expect(todo.is_scratched).toBeFalsy()
    expect(todo.created_at).toBe(createdAt)
  })

  it('should change title attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      priority: 'medium'
    })

    expect(Todo.validate).toHaveBeenCalledTimes(1)
    expect(todo.title).toBe('Supermarket')

    todo.changeTitle('Other title')

    expect(Todo.validate).toHaveBeenCalledTimes(2)
    expect(todo.title).toBe('Other title')
  })

  it('should change description attribute', () => {
    const todo = new Todo({
      title: 'Supermarket',
      priority: 'medium',
      description: 'Get mayonnaise and coffee'
    })

    expect(Todo.validate).toHaveBeenCalledTimes(1)
    expect(todo.description).toBe('Get mayonnaise and coffee')

    todo.changeDescription('Other description')

    expect(Todo.validate).toHaveBeenCalledTimes(2)
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
