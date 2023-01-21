import { ClassValidatorFields } from '../validators/class-validator'
import { FieldsErrors } from '../validators/validator-fields-interface'
import { EntityValidationError } from '../errors/invalid-validation-error'

import { expect } from 'expect'

type Expected = { validator: ClassValidatorFields<any>, data: any } | (() => any)

interface ErrorMessage { pass: boolean, message: () => string }

expect.extend({
  containsErrorMessages (expected: Expected, received: FieldsErrors): ErrorMessage {
    if (typeof expected === 'function') {
      try {
        expected()
        return isValid()
      } catch (err) {
        const error = err as EntityValidationError
        return assertContainsErrorsMessages(error.error, received)
      }
    } else {
      const { validator, data } = expected
      const validated = validator.validate(data)

      if (validated) {
        return isValid()
      }

      return assertContainsErrorsMessages(validator.errors, received)
    }
  }
})

function isValid (): ErrorMessage {
  return { pass: false, message: () => 'The data is valid' }
}

function assertContainsErrorsMessages (expected: FieldsErrors, received: FieldsErrors): ErrorMessage {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected)

  return isMatch
    ? { pass: true, message: () => '' }
    : {
        pass: false,
        message: () => (
        `The Validations errors not container ${JSON.stringify(received)}. 
          Current: ${JSON.stringify(expected)}`)
      }
}
