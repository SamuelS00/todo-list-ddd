import { InvalidUuidError } from '../errors/invalid-uuid.error'
import { v4 as uuid, validate as uuidValidate } from 'uuid'
import { ValueObject } from './value-object'

export class UniqueEntityId extends ValueObject<string> {
  constructor (readonly id?: string) {
    super(id ?? uuid())
    this.validate()
  }

  private validate (): void {
    const isValid = uuidValidate(this.value)

    if (!isValid) {
      throw new InvalidUuidError()
    }
  }
}

export default UniqueEntityId
