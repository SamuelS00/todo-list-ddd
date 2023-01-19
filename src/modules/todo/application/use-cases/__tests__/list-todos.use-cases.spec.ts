/* eslint-disable @typescript-eslint/dot-notation */

import { Todo } from '#todo/domain/entities/todo'
import TodoInMemoryRepository from '#todo/infrastructure/db/in-memory/todo-in-memory.repository'
import { TodoRepository } from '#todo/domain/repository/todo.repository'
import ListTodosUseCase from '../list-todos.use-cases'

describe('ListTodosUseCase Unit Tests', () => {
  let repository: TodoInMemoryRepository
  let useCase: ListTodosUseCase

  beforeEach(() => {
    repository = new TodoInMemoryRepository()
    useCase = new ListTodosUseCase(repository)
  })

  test('toOutput method', () => {
    let result = new TodoRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null
    })
    let output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2
    })

    const todo = new Todo({
      title: 'Buy a Book',
      priority: 'high',
      description: 'Description not defined'
    })
    result = new TodoRepository.SearchResult({
      items: [todo],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null
    })
    output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [todo.toJSON()],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2
    })
  })

  it('should returns output using empty input with categories ordered by created_at', async () => {
    const items: Todo[] = [
      new Todo({
        title: 'Buy a Book',
        priority: 'high',
        description: 'Description not defined'
      }),
      new Todo({
        title: 'Go to the gym',
        priority: 'high',
        description: 'arrive before 9 am',
        created_at: new Date(new Date().getTime() + 100)
      })
    ]

    repository.items = items

    const output = await useCase.execute({})

    expect(output).toStrictEqual({
      items: [...items].reverse().map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1
    })
  })

  it('should returns output using pagination, sort and filter', async () => {
    const items: Todo[] = [
      new Todo({
        title: 'app',
        priority: 'high'
      }),
      new Todo({
        title: 'AAA',
        priority: 'high'
      }),
      new Todo({
        title: 'AaA',
        priority: 'high'
      }),
      new Todo({
        title: 'bbb',
        priority: 'high'
      }),
      new Todo({
        title: 'ccc',
        priority: 'high'
      })
    ]

    repository.items = items

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'title',
      filter: 'a'
    })

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2
    })

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'title',
      filter: 'a'
    })

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2
    })

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'title',
      sort_dir: 'desc',
      filter: 'a'
    })

    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2
    })
  })
})
