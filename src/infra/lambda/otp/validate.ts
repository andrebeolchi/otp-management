import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import z from 'zod'

import { ValidateOTPUseCase } from '~/domain/otp-management/application/use-cases/validate-otp-use-case'

import { ValidateOTPController } from '~/adapters/controllers/otp/validate'

import { DynamoOTPRepository } from '~/adapters/gateways/database/otp/dynamo-otp-repository'

import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { validateOTPSchema } from '~/infra/validation/zod/schemas/validate-otp-schema'

const otpRepositoryGateway = new DynamoOTPRepository()

const validateOTPUseCase = new ValidateOTPUseCase(otpRepositoryGateway)

const schemaValidator = new ZodSchemaValidator<z.infer<typeof validateOTPSchema.body>>(validateOTPSchema.body)

const validateOTPController = new ValidateOTPController(validateOTPUseCase, schemaValidator)

export const validate = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = event.body ? JSON.parse(event.body) : {}

  const { body: responseBody, status } = await validateOTPController.execute({
    body,
  })

  return {
    statusCode: status,
    body: JSON.stringify(responseBody),
  }
}
