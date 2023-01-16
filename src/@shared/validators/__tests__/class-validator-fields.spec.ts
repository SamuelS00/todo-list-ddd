import { ClassValidatorFields } from '../class-validator'
import * as libClassValidator from 'class-validator'

class StubClassValidator extends ClassValidatorFields<{ field: string }> { }

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData variables with undefined', () => {
    const validator = new StubClassValidator()
    expect(validator.errors).toBeUndefined()
    expect(validator.validatedData).toBeUndefined()
  })

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')

    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'some error' } }
    ])

    const validator = new StubClassValidator()

    expect(validator.validate(null)).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(validator.validatedData).toBeUndefined()
    expect(validator.errors).toStrictEqual({ field: ['some error'] })
  })

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')

    spyValidateSync.mockReturnValue([])

    const validator = new StubClassValidator()

    expect(validator.validate({ field: 'value' })).toBeTruthy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(validator.validatedData).toStrictEqual({ field: 'value' })
    expect(validator.errors).toBeUndefined()
  })
})
