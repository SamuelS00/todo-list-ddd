/* eslint-disable @typescript-eslint/no-var-requires */
import { Priority } from '#todo/domain'
import { Model, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript'
import { SequelizeModelFactory } from '#shared/infrastructure/sequelize/sequelize-model-factory'

interface TodosModelProperties {
  id: string
  title: string
  priority: Priority
  description: string
  is_scratched: boolean
  created_at: Date
}

@Table({ tableName: 'todos', timestamps: false })
export class TodoModel extends Model<TodosModelProperties> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare title: string

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare priority: string

  @Column({ allowNull: false, type: DataType.TEXT })
  declare description: string

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_scratched: boolean

  @Column({ allowNull: false, type: DataType.DATE })
  declare created_at: Date

  static factory (): SequelizeModelFactory {
    const chance: Chance.Chance = require('chance')
    return new SequelizeModelFactory(TodoModel, () => ({
      id: chance.guid({ version: 4 }),
      title: chance.word(),
      priority: chance.shuffle(['low', 'medium', 'high']),
      description: chance.sentence({ words: 5 }),
      is_scratched: false,
      created_at: chance.date()
    }))
  }
}
