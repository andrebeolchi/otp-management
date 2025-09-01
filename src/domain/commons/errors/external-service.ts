import { CustomError } from './custom'

export class ExternalServiceError extends CustomError {
  status = 500

  constructor(message: string) {
    super(message)
  }
}
