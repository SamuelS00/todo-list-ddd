import { deepFreeze } from './object'

describe('Object Unit Tests', () => {
  it('should not freeze a scalar value', () => {
    const str = deepFreeze('a')
    expect(typeof str).toBe('string')

    let boolean = deepFreeze(true)
    expect(typeof boolean).toBe('boolean')

    boolean = deepFreeze(false)
    expect(typeof boolean).toBe('boolean')

    const number = deepFreeze(5)
    expect(typeof number).toBe('number')
  })

  it('should must be a immutable object', () => {
    const obj = deepFreeze({
      prop1: 'vasco',
      deep: { prop2: 'varmengo', prop3: new Date() }
    })

    expect(() => {
      (obj as any).prop1 = 'aaaaaaa'
    }).toThrow('Cannot assign to read only property \'prop1\' of object \'#<Object>\'')

    expect(() => {
      (obj as any).deep.prop2 = 'aaaaaaa'
    }).toThrow('Cannot assign to read only property \'prop2\' of object \'#<Object>\'')

    expect(obj.deep.prop3).toBeInstanceOf(Date)
  })
})
