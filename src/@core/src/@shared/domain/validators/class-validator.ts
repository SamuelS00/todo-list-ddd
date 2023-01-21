import { validateSync, ValidationError } from 'class-validator'
import {
  ValidatorFieldsInterface,
  FieldsErrors
} from '../validators/validator-fields-interface'

export abstract class ClassValidatorFields<PropsValidated> implements ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors
  validatedData: PropsValidated
  validate (data: any): boolean {
    const errors: ValidationError[] = validateSync(data)

    if (errors.length > 0) {
      this.errors = {}

      for (const error of errors) {
        const field: string = error.property
        if (error.constraints != null) this.errors[field] = Object.values(error.constraints)
      }
    } else {
      this.validatedData = data
    }

    return errors.length === 0
  }
}
