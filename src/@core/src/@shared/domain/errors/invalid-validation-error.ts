import { FieldsErrors } from '../validators/validator-fields-interface'

export class InvalidValidationError extends Error { }

export class EntityValidationError extends Error {
  constructor (public error: FieldsErrors) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
    this.error = error
  }
}
