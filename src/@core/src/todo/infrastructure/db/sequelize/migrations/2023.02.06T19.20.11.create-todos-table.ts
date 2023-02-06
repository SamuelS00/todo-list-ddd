import { MigrationFn } from 'umzug'
import { Sequelize, DataTypes } from 'sequelize'

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('todos', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER(),
      allowNull: false
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_scratched: { type: DataTypes.BOOLEAN, allowNull: false },
    created_at: { type: DataTypes.DATE(3), allowNull: false }
  })
}

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('todos')
}
