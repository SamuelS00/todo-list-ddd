import { PriorityError } from '../../errors/priority-type.error'
import { PriorityType } from '../priority-type.vo'

describe('PriorityType Unit Tests', () => {
  it('should create a vo ', () => {
    let vo = new PriorityType({
      code: 1,
      description: 'Low'
    })
    expect(vo).toMatchObject({
      code: 1,
      description: 'Low'
    })
    vo = new PriorityType({
      code: 2,
      description: 'Medium'
    })
    expect(vo).toMatchObject({
      code: 2,
      description: 'Medium'
    })
    vo = new PriorityType({
      code: 3,
      description: 'High'
    })
    expect(vo).toMatchObject({
      code: 3,
      description: 'High'
    })
  })

  it('should throw an error', () => {
    expect(
      () =>
        new PriorityType({
          code: 4,
          description: 'error'
        })
    ).toThrowError(
      new PriorityError('code must be either 1, 2 or 3')
    )

    expect(
      () =>
        new PriorityType({
          code: 1,
          description: 'Medium'
        })
    ).toThrowError(
      new PriorityError(
        'description must be low when code is 1'
      )
    )

    expect(
      () =>
        new PriorityType({
          code: 2,
          description: 'High'
        })
    ).toThrowError(
      new PriorityError('description must be medium when code is 2')
    )
  })

  it('should create a low priority vo', () => {
    const vo = PriorityType.createLow()

    expect(vo.value).toEqual({
      code: 1,
      description: 'Low'
    })

    expect(vo.code).toBe(1)
    expect(vo.description).toBe('Low')
  })

  it('should create an medium priority vo', () => {
    const vo = PriorityType.createMedium()

    expect(vo.value).toEqual({
      code: 2,
      description: 'Medium'
    })

    expect(vo.code).toBe(2)
    expect(vo.description).toBe('Medium')
  })

  it('should create an high priority vo', () => {
    const vo = PriorityType.createHigh()

    expect(vo.value).toEqual({
      code: 3,
      description: 'High'
    })

    expect(vo.code).toBe(3)
    expect(vo.description).toBe('High')
  })

  it('should not be equal', () => {
    const low = PriorityType.createLow()
    const medium = PriorityType.createMedium()
    const high = PriorityType.createHigh()

    expect(low.equals(medium)).toBeFalsy()
    expect(medium.equals(high)).toBeFalsy()
    expect(high.equals(low)).toBeFalsy()
  })

  it('should be equal', () => {
    let vo1 = PriorityType.createLow()
    let vo2 = PriorityType.createLow()
    expect(vo1.equals(vo2)).toBeTruthy()

    vo1 = PriorityType.createMedium()
    vo2 = PriorityType.createMedium()

    expect(vo1.equals(vo2)).toBeTruthy()

    vo1 = PriorityType.createHigh()
    vo2 = PriorityType.createHigh()

    expect(vo1.equals(vo2)).toBeTruthy()
  })

  it('should create vo by code', () => {
    let vo = PriorityType.createByCode(1)

    expect(vo.value).toEqual({
      code: 1,
      description: 'Low'
    })
    expect(vo.code).toBe(1)
    expect(vo.description).toBe('Low')

    vo = PriorityType.createByCode(2)

    expect(vo.value).toEqual({
      code: 2,
      description: 'Medium'
    })
    expect(vo.code).toBe(2)
    expect(vo.description).toBe('Medium')

    vo = PriorityType.createByCode(3)

    expect(vo.value).toEqual({
      code: 3,
      description: 'High'
    })
    expect(vo.code).toBe(3)
    expect(vo.description).toBe('High')
  })

  it('should throw an error when code is invalid', () => {
    expect(() => PriorityType.createByCode(4)).toThrow(
      new PriorityError(
        'code must be either 1 for low, 2 for medium or 3 for high'
      )
    )
  })
})
