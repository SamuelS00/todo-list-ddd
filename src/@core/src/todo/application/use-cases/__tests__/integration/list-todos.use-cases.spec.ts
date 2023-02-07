import { ListTodosUseCase } from '../../list-todos.use-cases'
import { TodoSequelize } from '#todo/infrastructure/db/sequelize/todo-sequelize'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'
import { Todo } from '#todo/domain'

const { TodoModel, TodoSequelizeRepository } = TodoSequelize

describe('ListTodosUseCase Integration Tests', () => {
  let repository = new TodoSequelizeRepository(TodoModel)
  let useCase: ListTodosUseCase.UseCase

  setupSequelize({ models: [TodoModel] })

  beforeEach(() => {
    repository = new TodoSequelizeRepository(TodoModel)
    useCase = new ListTodosUseCase.UseCase(repository)
  })

  it('should returns output using empty input with todos ordered by created_at', async () => {
    const faker = Todo.fake().theTodos(2)

    const entities = faker
      .withTitle((index) => `Todo: ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()

    await repository.bulkInsert(entities)

    const output = await useCase.execute({})

    expect(output).toMatchObject({
      items: [...entities].reverse().map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1
    })
  })

  it('should returns output using pagination, sort and filter', async () => {
    const faker = Todo.fake().aTodo()

    const entities = [
      faker.withTitle('app').build(),
      faker.withTitle('AAA').build(),
      faker.withTitle('AaA').build(),
      faker.withTitle('bbb').build(),
      faker.withTitle('ccc').build()
    ]

    await repository.bulkInsert(entities)

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'title',
      filter: 'a'
    })

    expect(output).toMatchObject({
      items: [entities[1], entities[2]].map((i) => i.toJSON()),
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

    expect(output).toMatchObject({
      items: [entities[0]].map((i) => i.toJSON()),
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

    expect(output).toMatchObject({
      items: [entities[0], entities[2]].map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2
    })
  })
})
