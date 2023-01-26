import { ListTodosUseCase } from '../../list-todos.use-cases'
import { TodoSequelize } from '#todo/infrastructure/db/sequelize/todo-sequelize'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'
import { DataGenerator } from '#shared/infrastructure/testing/helpers/data-generator'
import { genPriorityOption } from '#shared/infrastructure/testing/helpers/generate-priority-option'

const { TodoModel, TodoSequelizeRepository, TodoModelMapper } = TodoSequelize

describe('ListTodosUseCase Integration Tests', () => {
  let repository = new TodoSequelizeRepository(TodoModel)
  let useCase: ListTodosUseCase.UseCase

  setupSequelize({ models: [TodoModel] })

  beforeEach(() => {
    repository = new TodoSequelizeRepository(TodoModel)
    useCase = new ListTodosUseCase.UseCase(repository)
  })

  it('should returns output using empty input with categories ordered by created_at', async () => {
    const models = await TodoModel.factory().count(2).bulkCreate((index: number) => {
      return {
        id: DataGenerator.uuid(),
        title: `Todo ${index}`,
        priority: genPriorityOption(),
        description: DataGenerator.sentence(),
        is_scratched: false,
        created_at: new Date(new Date().getTime() + index)
      }
    })

    const output = await useCase.execute({})

    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(TodoModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1
    })
  })

  it('should returns output using pagination, sort and filter', async () => {
    const models = TodoModel.factory().count(5).bulkMake()
    models[0].title = 'app'
    models[1].title = 'AAA'
    models[2].title = 'AaA'
    models[3].title = 'bbb'
    models[4].title = 'ccc'
    await TodoModel.bulkCreate(models.map((m) => m.toJSON()))

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'title',
      filter: 'a'
    })

    expect(output).toMatchObject({
      items: [models[1], models[2]]
        .map(TodoModelMapper.toEntity)
        .map((i) => i.toJSON()),
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
      items: [models[0]]
        .map(TodoModelMapper.toEntity)
        .map((i) => i.toJSON()),
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
      items: [models[0], models[2]]
        .map(TodoModelMapper.toEntity)
        .map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2
    })
  })
})
