import { Todo } from '#todo/domain/entities/todo'
import NotFoundError from '#shared/domain/errors/not-found-error'
import TodoInMemoryRepository from '#todo/infrastructure/db/in-memory/todo-in-memory.repository'
import UpdateTitleTodoUseCase from '../update-todo.use-cases'

describe('UpdateTodoUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: UpdateTitleTodoUseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new UpdateTitleTodoUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    void expect(async () => await useCase.execute({ id: 'fake-id', title: 'fake' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should create a todo', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const entity = new Todo({
      title: 'Supermarket',
      priority: 'low'
    })

    repository.items = [entity]

    let output = await useCase.execute({
      id: entity.id,
      title: 'test'
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: entity.id,
      title: 'test',
      description: 'Description not defined',
      priority: 'low',
      is_scratched: false,
      created_at: entity.created_at
    })

    interface Arrange {
      input: {
        id: string
        title: string
        priority?: string
        description?: null | string
        is_scratched?: boolean
      }
      expected: {
        id: string
        title: string
        description: null | string
        priority?: string
        is_scratched: boolean
        created_at: Date
      }
    }

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          title: 'test',
          description: 'some description'
        },
        expected: {
          id: entity.id,
          title: 'test',
          description: 'some description',
          priority: 'low',
          is_scratched: false,
          created_at: entity.created_at as Date
        }
      },
      {
        input: {
          id: entity.id,
          title: 'test',
          priority: 'low'
        },
        expected: {
          id: entity.id,
          title: 'test',
          priority: 'low',
          description: 'Description not defined',
          is_scratched: false,
          created_at: entity.created_at as Date
        }
      }// ,
    //   {
    //     input: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       is_scratched: false
    //     },
    //     expected: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       description: 'Description not defined',
    //       is_scratched: false,
    //       created_at: entity.created_at as Date
    //     }
    //   },
    //   {
    //     input: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low'
    //     },
    //     expected: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       description: 'Description not defined',
    //       is_scratched: false,
    //       created_at: entity.created_at as Date
    //     }
    //   },
    //   {
    //     input: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       is_scratched: true
    //     },
    //     expected: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       description: 'Description not defined',
    //       is_scratched: true,
    //       created_at: entity.created_at as Date
    //     }
    //   },
    //   {
    //     input: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       description: 'some description',
    //       is_scratched: false
    //     },
    //     expected: {
    //       id: entity.id,
    //       title: 'test',
    //       priority: 'low',
    //       description: 'some description',
    //       is_scratched: false,
    //       created_at: entity.created_at as Date
    //     }
    //   }
    ]

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        title: i.input.title,
        description: i.input.description as string,
        is_scratched: i.input.is_scratched
      })
      expect(output).toStrictEqual({
        id: entity.id,
        title: i.expected.title,
        description: i.expected.description,
        priority: i.expected.priority,
        is_scratched: i.expected.is_scratched,
        created_at: i.expected.created_at
      })
    }
  })
})
