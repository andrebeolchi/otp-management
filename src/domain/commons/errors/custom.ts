export abstract class CustomError extends Error {
  abstract status: number
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
