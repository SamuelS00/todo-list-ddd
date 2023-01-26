import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { configTest } from '../../config'

const sequelizeOptions: SequelizeOptions = {
  dialect: configTest.db.vendor,
  host: configTest.db.host,
  logging: configTest.db.logging
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
