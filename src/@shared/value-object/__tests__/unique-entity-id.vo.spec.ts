import InvalidUuidError from '../../errors/invalid-uuid.error'
import UniqueEntityId from '../unique-entity-id.vo'
import { validate as uuidValidate } from 'uuid'

function spyValidateMethod (): jest.SpyInstance<any, unknown[]> {
  return jest.spyOn(UniqueEntityId.prototype as any, 'validate')
}

describe('UniqueEntityId unity test', () => {
  it('should throw error when uuid is invalid', () => {
    const validateSpy = spyValidateMethod()

    expect(() => new UniqueEntityId('fake-id')).toThrowError(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalled()
  })

  it('should accept a uuid passed in constructor', () => {
    const validateSpy = spyValidateMethod()
    const uuid = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6'
    const voId = new UniqueEntityId(uuid)

    expect(voId.value).toBe(uuid)
    expect(validateSpy).toHaveBeenCalled()
  })

  it('should not pass anything in the constructor', () => {
    const validateSpy = spyValidateMethod()
    const voId = new UniqueEntityId()

    expect(uuidValidate(voId.value)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalled()
  })
})
