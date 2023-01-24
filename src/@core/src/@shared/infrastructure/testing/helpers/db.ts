import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

const sequelizeOptions: SequelizeOptions = {
  dialect: 'sqlite',
  host: ':memory:',
  logging: false
}

export function setupSequelize (options: SequelizeOptions = {}): { sequelize: Sequelize } {
  let _sequelize: Sequelize = new Sequelize({ ...sequelizeOptions, ...options })

  beforeAll(() => {
    _sequelize = new Sequelize({
      ...sequelizeOptions,
      ...options
    })
  })

  beforeEach(async () => {
    await _sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await _sequelize.close()
  })

  return {
    get sequelize () {
      return _sequelize
    }
  }
}
