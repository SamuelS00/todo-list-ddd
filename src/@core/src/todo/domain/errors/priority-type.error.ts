export class PriorityError extends Error {
  constructor (message?: string) {
    super(message ?? 'Invalid params to Priority')
    this.name = 'InvalidPriorityError'
  }
}
