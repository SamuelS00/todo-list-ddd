/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { deepFreeze } from '../../utils/object'
import ValueObject from '../value-object'

class StubValueObject extends ValueObject { }

describe('ValueObject Unit Testes', () => {
  it('should set value', () => {
    let vo = new StubValueObject('string value')
    expect(vo.value).toBe('string value')

    vo = new StubValueObject({ prop1: 'value1' })
    expect(vo.value).toStrictEqual({ prop1: 'value1' })
  })

  it('should convert to a string', () => {
    const date = new Date()
    const arrange = [
      { received: '', expected: '' },
      { received: 'ten', expected: 'ten' },
      { received: 10, expected: '10' },
      { received: 0, expected: '0' },
      { received: true, expected: 'true' },
      { received: false, expected: 'false' },
      { received: date, expected: date.toString() },
      { received: { prop1: 'prop1' }, expected: JSON.stringify({ prop1: 'prop1' }) }
    ]

    arrange.forEach((i) => {
      const vo = new StubValueObject(i.received)
      expect(`${vo}`).toBe(i.expected)
    })
  })

  it('should must be a immutable object', () => {
    const vo = deepFreeze({
      prop1: 'vasco',
      deep: { prop2: 'varmengo', prop3: new Date() }
    })

    expect(() => {
      (vo as any).prop1 = 'test'
    }).toThrow('Cannot assign to read only property \'prop1\' of object \'#<Object>\'')

    expect(() => {
      (vo as any).deep.prop2 = 'test'
    }).toThrow('Cannot assign to read only property \'prop2\' of object \'#<Object>\'')

    expect(vo.deep.prop3).toBeInstanceOf(Date)
  })
})
