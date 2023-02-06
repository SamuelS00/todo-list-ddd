import { migrator } from './migrator'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: true
})

void migrator(sequelize).runAsCLI()
