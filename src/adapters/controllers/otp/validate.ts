import { ValidateOTPUseCase } from '~/domain/otp-management/application/use-cases/validate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { Response } from '~/adapters/controllers/interfaces/response'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

export interface Body {
  otp: string
  recipientType: 'email' | 'sms'
  recipientValue: string
}

export interface ValidateOTPResponse {
  isValid: boolean
  message?: string
}

export class ValidateOTPController {
  constructor(
    private validateOTPUseCase: ValidateOTPUseCase,
    private schemaValidator: SchemaValidator<Body>
  ) {}

  async execute({ body }: Request<Body>): Promise<Response<ValidateOTPResponse>> {
    try {
      const { data, errors } = this.schemaValidator.execute(body)

      if (errors?.length) {
        return {
          status: 400,
          body: errors,
        }
      }

      const result = await this.validateOTPUseCase.execute({
        otp: data.otp,
        recipientType: data.recipientType,
        recipientValue: data.recipientValue,
      })

      if (result.status === 'expired') {
        return {
          status: 410,
          body: { isValid: false, message: 'OTP has expired' },
        }
      }

      if (result.status === 'invalid') {
        return {
          status: 400,
          body: { isValid: false, message: 'Invalid OTP' },
        }
      }

      return {
        status: 200,
        body: { isValid: true },
      }
    } catch (error) {
      return errorHandler(error)
    }
  }
}
