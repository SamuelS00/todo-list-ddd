import { FieldsErrors } from './@shared/domain/repository/repository-contracts'

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R
    }
  }
}

export {}
