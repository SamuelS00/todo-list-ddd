import { validate as uuidValidate } from 'uuid'
import {
  Table,
  Column,
  PrimaryKey,
  Model,
  DataType
} from 'sequelize-typescript'

import { setupSequelize } from '../testing/helpers/db'
import { SequelizeModelFactory } from './sequelize-model.factory'
import { DataGenerator } from '../testing/helpers/data-generator'

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare title: string

  static mockFactory = jest.fn(() => ({
    id: DataGenerator.uuid(),
    title: DataGenerator.word()
  }))

  static factory (): SequelizeModelFactory<StubModel> {
    return new SequelizeModelFactory<StubModel, { id: string, title: string }>(
      StubModel,
      StubModel.mockFactory
    )
  }
}

describe('SequelizeModelFactory Unit Tests', () => {
  setupSequelize({ models: [StubModel] })

  test('create method', async () => {
    let model = await StubModel.factory().create()
    console.log(model)
    expect(uuidValidate(model.id)).toBeTruthy()
    expect(model.id).not.toBeNull()
    expect(model.title).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalled()

    let modelFound = await StubModel.findByPk(model.id)
    expect(model.id).toBe(modelFound?.id)

    model = await StubModel.factory().create({
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      title: 'test'
    })
    expect(model.id).toBe('9366b7dc-2d71-4799-b91c-c64adb205104')
    expect(model.title).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    modelFound = await StubModel.findByPk(model.id)
    expect(model.id).toBe(modelFound?.id)
  })

  test('make method', async () => {
    let model = StubModel.factory().make()
    expect(uuidValidate(model.id)).toBeTruthy()
    expect(model.id).not.toBeNull()
    expect(model.title).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalled()

    model = StubModel.factory().make({
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      title: 'test'
    })
    expect(model.id).toBe('9366b7dc-2d71-4799-b91c-c64adb205104')
    expect(model.title).toBe('test')

    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)
  })

  test('bulkCreate method using count = 1', async () => {
    let models = await StubModel.factory().bulkCreate()

    // count default is 1.
    expect(models).toHaveLength(1)
    expect(models[0].id).not.toBeNull()
    expect(models[0].title).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalled()

    let modelFound = await StubModel.findByPk(models[0].id)
    expect(models[0].id).toBe(modelFound?.id)
    expect(models[0].title).toBe(modelFound?.title)

    models = await StubModel.factory().bulkCreate(() => ({
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      title: 'test'
    }))

    expect(models[0].id).toBe('9366b7dc-2d71-4799-b91c-c64adb205104')
    expect(models[0].title).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    modelFound = await StubModel.findByPk(models[0].id)
    expect(models[0].id).toBe(modelFound?.id)
    expect(models[0].title).toBe(modelFound?.title)
  })

  test('bulkCreate method using count > 1', async () => {
    let models = await StubModel.factory().count(2).bulkCreate()

    expect(models).toHaveLength(2)
    expect(models[0].id).not.toBeNull()
    expect(models[0].title).not.toBeNull()
    expect(models[1].id).not.toBeNull()
    expect(models[1].title).not.toBeNull()
    expect(models[0].id).not.toBe(models[1].title)
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)

    const modelFound1 = await StubModel.findByPk(models[0].id)
    expect(models[0].id).toBe(modelFound1?.id)
    expect(models[0].title).toBe(modelFound1?.title)

    const modelFound2 = await StubModel.findByPk(models[1].id)
    expect(models[1].id).toBe(modelFound2?.id)
    expect(models[1].title).toBe(modelFound2?.title)

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: DataGenerator.uuid(),
        title: 'test'
      }))
    expect(models).toHaveLength(2)
    expect(models[0].id).not.toBe(models[1].id)
    expect(models[0].title).toBe('test')
    expect(models[1].title).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
  })

  test('bulkMake method using count = 1', async () => {
    let models = StubModel.factory().bulkMake()

    expect(models).toHaveLength(1)
    expect(models[0].id).not.toBeNull()
    expect(models[0].title).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    models = StubModel.factory().bulkMake(() => ({
      id: '5490020a-e866-4229-9adc-aa44b83234c4',
      title: 'test'
    }))

    expect(models).toHaveLength(1)
    expect(models[0].id).toBe('5490020a-e866-4229-9adc-aa44b83234c4')
    expect(models[0].title).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)
  })

  test('bulkMake method using count > 1', async () => {
    let models = StubModel.factory().count(2).bulkMake()

    expect(models).toHaveLength(2)
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
    expect(models[0].id).not.toBeNull()
    expect(models[0].title).not.toBeNull()
    expect(models[1].id).not.toBeNull()
    expect(models[1].title).not.toBeNull()
    expect(models[0].id).not.toBe(models[1].title)

    models = StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: DataGenerator.uuid(),
        title: 'test'
      }))

    expect(models).toHaveLength(2)
    expect(models[0].id).not.toBe(models[1].id)
    expect(models[0].title).toBe('test')
    expect(models[1].title).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
  })
})
