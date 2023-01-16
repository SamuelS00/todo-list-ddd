import { FieldsErrors } from '../validators/validator-fields-interface'

export class InvalidValidationError extends Error { }

export class EntityValidationError extends Error {
  // eslint-disable-next-line n/handle-callback-err
  constructor (public error: FieldsErrors) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}
