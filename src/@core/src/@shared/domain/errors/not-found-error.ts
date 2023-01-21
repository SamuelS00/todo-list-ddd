export class NotFoundError extends Error {
  constructor (message?: string) {
    super(message ?? 'ID must be a valid UUID')
    this.name = 'NotFoundError'
  }
}

export default NotFoundError
