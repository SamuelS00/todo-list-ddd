export type FieldsErrors = Record<string, string[]>

export default interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors
  validatedData: PropsValidated
  validate: (data: any) => boolean
}
