import { Priority } from '#todo/domain'
import { DataType, Sequelize } from 'sequelize-typescript'
import { TodoModel } from './todo.model'

describe('TodoModel Unit Tests', () => {
  let sequelize: Sequelize

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      host: ':memory:',
      logging: false,
      models: [TodoModel]
    })
  })

  beforeEach(async () => await sequelize.sync({ force: true }))

  afterAll(async () => { await sequelize.close() })

  test('mapping attributes', () => {
    const attributesMap = TodoModel.getAttributes()
    const attributes = Object.keys(TodoModel.getAttributes())

    expect(attributes).toStrictEqual([
      'id',
      'title',
      'priority',
      'description',
      'is_scratched',
      'created_at'
    ])

    expect(attributesMap.id).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID()
    })

    expect(attributesMap.title).toMatchObject({
      field: 'title',
      fieldName: 'title',
      allowNull: false,
      type: DataType.STRING(255)
    })

    expect(attributesMap.description).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT()
    })

    expect(attributesMap.is_scratched).toMatchObject({
      field: 'is_scratched',
      fieldName: 'is_scratched',
      allowNull: false,
      type: DataType.BOOLEAN()
    })

    expect(attributesMap.created_at).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE()
    })
  })

  test('create', async () => {
    const arrange = {
      id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
      title: 'Supermarket',
      description: 'Description not defined',
      priority: 'low' as Priority,
      is_scratched: false,
      created_at: new Date()
    }

    const todo = await TodoModel.create(arrange)

    expect(todo.toJSON()).toStrictEqual(arrange)
  })
})
