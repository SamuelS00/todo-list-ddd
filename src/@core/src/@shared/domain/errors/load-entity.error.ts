/* eslint-disable n/handle-callback-err */
import { FieldsErrors } from '../validators/validator-fields-interface'

export class LoadEntityError extends Error {
  constructor (public error: FieldsErrors, message?: string) {
    super(message ?? 'An entity could not be loaded')
    this.name = 'LoadEntityError'
  }
}
