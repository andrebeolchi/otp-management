import { GenerateOTPUseCase } from '~/application/use-cases/generate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { Response } from '~/adapters/controllers/interfaces/response'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

export interface Body {
  email: string
}

export interface ResponseBody {
  otp: string
}

export class GenerateOTPController {
  constructor(
    private generateOTPUseCase: GenerateOTPUseCase,
    private schemaValidator: SchemaValidator<Body>
  ) {}

  async execute({ body }: Request<Body>): Promise<Response<ResponseBody>> {
    try {
      const { data, errors } = this.schemaValidator.execute(body)

      if (errors?.length) {
        return {
          status: 400,
          body: errors,
        }
      }

      const result = await this.generateOTPUseCase.execute({ email: data.email })

      return {
        status: 201,
        body: result,
      }
    } catch (error) {
      return errorHandler(error)
    }
  }
}
