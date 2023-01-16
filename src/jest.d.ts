import { FieldsErrors } from './@shared/validators/validator-fields-interface'

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R
    }
  }
}

export {}
