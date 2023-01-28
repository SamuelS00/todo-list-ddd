import { Todo } from '../../../../domain/entities/todo'
import { TodoInMemoryRepository } from '../../../../infrastructure/db/in-memory/todo-in-memory.repository'
import { UpdateTodoUseCase } from '../../update-todo.use-cases'
import { NotFoundError } from '../../../../../@shared/domain/errors/not-found-error'

describe('UpdateTodoUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: UpdateTodoUseCase.UseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new UpdateTodoUseCase.UseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    void expect(async () => await useCase.execute({ id: 'fake-id', title: 'fake' })).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake-id')
    )
  })

  it('should create a todo', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const entity = new Todo({
      title: 'Supermarket'
    })

    repository.items = [entity]

    let output = await useCase.execute({
      id: entity.id,
      title: 'test'
    })

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: entity.id.toString(),
      title: 'test',
      description: null,
      priority: 2,
      is_scratched: false,
      created_at: entity.created_at
    })

    interface Arrange {
      input: {
        id: string
        title: string
        priority?: number
        description?: null | string
        is_scratched?: boolean
      }
      expected: {
        id: string
        title: string
        description: null | string
        priority?: number
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
          priority: 2,
          is_scratched: false,
          created_at: entity.created_at
        }
      },
      {
        input: {
          id: entity.id,
          title: 'test',
          priority: 3
        },
        expected: {
          id: entity.id,
          title: 'test',
          priority: 3,
          description: 'some description',
          is_scratched: false,
          created_at: entity.created_at
        }
      },
      {
        input: {
          id: entity.id,
          title: 'test',
          priority: 1,
          is_scratched: false
        },
        expected: {
          id: entity.id,
          title: 'test',
          priority: 1,
          description: 'some description',
          is_scratched: false,
          created_at: entity.created_at
        }
      },
      {
        input: {
          id: entity.id,
          title: 'test',
          priority: 1
        },
        expected: {
          id: entity.id,
          title: 'test',
          priority: 1,
          description: 'some description',
          is_scratched: false,
          created_at: entity.created_at
        }
      },
      {
        input: {
          id: entity.id,
          title: 'test',
          priority: 1,
          is_scratched: true
        },
        expected: {
          id: entity.id,
          title: 'test',
          priority: 1,
          description: 'some description',
          is_scratched: true,
          created_at: entity.created_at
        }
      },
      {
        input: {
          id: entity.id,
          title: 'test',
          priority: 1,
          description: 'some description',
          is_scratched: false
        },
        expected: {
          id: entity.id,
          title: 'test',
          priority: 1,
          description: 'some description',
          is_scratched: false,
          created_at: entity.created_at
        }
      }
    ]

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        title: i.input.title,
        priority: i.input.priority,
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
