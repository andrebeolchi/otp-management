import { GenerateOTPUseCase } from '~/domain/otp-management/application/use-cases/generate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { Response } from '~/adapters/controllers/interfaces/response'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

export interface Body {
  recipientType: 'email'
  recipientValue: string
}

export class GenerateOTPController {
  constructor(
    private generateOTPUseCase: GenerateOTPUseCase,
    private schemaValidator: SchemaValidator<Body>
  ) {}

  async execute({ body }: Request<Body>): Promise<Response> {
    try {
      const { data, errors } = this.schemaValidator.execute(body)

      if (errors?.length) {
        return {
          status: 400,
          body: errors,
        }
      }

      await this.generateOTPUseCase.execute({
        recipientType: data.recipientType,
        recipientValue: data.recipientValue,
      })

      return {
        status: 201,
        body: [{ message: 'OTP generated successfully' }],
      }
    } catch (error) {
      return errorHandler(error)
    }
  }
}
