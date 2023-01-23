import { Todo } from '#todo/domain/entities/todo'
import { NotFoundError } from '#shared/domain/errors/not-found-error'
import { Sequelize } from 'sequelize-typescript'
import { TodoModel } from './todo.model'
import TodoSequelizeRepository from './todo-sequelize.repository'

describe('TodoSequelizeRepository Unit Tests', () => {
  let sequelize: Sequelize
  let repository: TodoSequelizeRepository

  beforeAll(
    () =>
      (sequelize = new Sequelize({
        dialect: 'sqlite',
        host: ':memory:',
        logging: false,
        models: [TodoModel]
      }))
  )

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    repository = new TodoSequelizeRepository(TodoModel)
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should insert a new entity', async () => {
    let entity = new Todo({ title: 'Supermarket', priority: 'low' })

    void repository.insert(entity)

    let model = await TodoModel.findByPk(entity.id)
    expect(model?.toJSON()).toStrictEqual(entity.toJSON())

    entity = new Todo({
      title: 'Gym',
      priority: 'low',
      description: 'new description',
      is_scratched: false,
      created_at: new Date()
    })

    void repository.insert(entity)

    model = await TodoModel.findByPk(entity.id)
    expect(model?.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should find an entity', async () => {
    const entity = new Todo({ title: 'Supermarket', priority: 'low' })

    void repository.insert(entity)

    const todo = await repository.findById(entity.id)
    expect(todo.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should throw an error when entity has not been found', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id')
    )
    await expect(
      repository.findById('312cffad-1938-489e-a706-643dc9a3cfd3')
    ).rejects.toThrow(
      new NotFoundError(
        'Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3'
      )
    )
  })

  it('should find an entity by Id', async () => {
    const entity = new Todo({ title: 'Supermarket', priority: 'low' })
    await repository.insert(entity)

    let entityFound = await repository.findById(entity.id)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())

    entityFound = await repository.findById(entity.uniqueEntityId)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  it('should return all todos', async () => {
    const entity = new Todo({
      title: 'supermarket',
      priority: 'low'
    })

    await repository.insert(entity)
    const entities = await repository.findAll()
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  })
})
