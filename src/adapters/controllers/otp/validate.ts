import { ValidateOTPUseCase } from '~/domain/otp-management/application/use-cases/validate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { Response } from '~/adapters/controllers/interfaces/response'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { Logger } from '~/infra/logger'

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
    private schemaValidator: SchemaValidator<Body>,
    private logger: Logger
  ) {}

  async execute({ body }: Request<Body>): Promise<Response<ValidateOTPResponse>> {
    try {
      this.logger.debug('validating request for OTP validation', { recipientType: body.recipientType, otp: body.otp })
      const { data, errors } = this.schemaValidator.execute(body)

      if (errors?.length) {
        this.logger.warn('validation failed for OTP validation request', { errors })
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
        this.logger.warn('OTP validation failed: OTP expired', { recipientType: data.recipientType, otp: body.otp })
        return {
          status: 410,
          body: { isValid: false, message: 'OTP has expired' },
        }
      }

      if (result.status === 'invalid') {
        this.logger.warn('OTP validation failed: OTP invalid', { recipientType: data.recipientType, otp: body.otp })
        return {
          status: 400,
          body: { isValid: false, message: 'Invalid OTP' },
        }
      }

      this.logger.info('OTP validated successfully', { recipientType: data.recipientType, otp: body.otp })
      return {
        status: 200,
        body: { isValid: true },
      }
    } catch (error) {
      this.logger.error('unexpected error during OTP validation', { error })
      return errorHandler(error)
    }
  }
}
