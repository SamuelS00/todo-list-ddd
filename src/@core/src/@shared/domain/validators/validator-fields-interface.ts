export type FieldsErrors = Record<string, string[]>

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors
  validatedData: PropsValidated
  validate: (data: any) => boolean
}

export default ValidatorFieldsInterface
