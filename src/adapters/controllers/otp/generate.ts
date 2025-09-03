import { GenerateOTPUseCase } from '~/domain/otp-management/application/use-cases/generate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { Response } from '~/adapters/controllers/interfaces/response'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { Logger } from '~/infra/logger'

export interface Body {
  recipientType: 'email' | 'sms'
  recipientValue: string
}

export class GenerateOTPController {
  constructor(
    private generateOTPUseCase: GenerateOTPUseCase,
    private schemaValidator: SchemaValidator<Body>,
    private logger: Logger
  ) {}

  async execute({ body }: Request<Body>): Promise<Response<{ message: string }>> {
    try {
      this.logger.debug('validating generate OTP request for ', { type: body.recipientType })
      const { data, errors } = this.schemaValidator.execute(body)

      if (errors?.length) {
        this.logger.warn('validation failed for generate OTP request', { errors })
        return {
          status: 400,
          body: errors,
        }
      }

      await this.generateOTPUseCase.execute({
        recipientType: data.recipientType,
        recipientValue: data.recipientValue,
      })

      this.logger.info('OTP generated successfully for ', { type: data.recipientType })
      return {
        status: 201,
        body: { message: 'OTP generated successfully' },
      }
    } catch (error) {
      this.logger.error('error generating OTP', { error })
      return errorHandler(error)
    }
  }
}
