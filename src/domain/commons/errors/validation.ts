import { CustomError } from './custom'

export class ValidationError extends CustomError {
  status = 400

  constructor(message: string) {
    super(message)
  }
}
