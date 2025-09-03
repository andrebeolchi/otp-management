import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { ValidateOTPUseCase } from '~/domain/otp-management/application/use-cases/validate-otp-use-case'

import { ValidateOTPController } from '~/adapters/controllers/otp/validate'

import { PrismaOTPRepository } from '~/adapters/gateways/database/otp/prisma-otp-repository'

import { PinoLogger } from '~/infra/logger/pino'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { validateOTPSchema } from '~/infra/validation/zod/schemas/validate-otp-schema'

const logger = new PinoLogger()

const otpRepositoryGateway = new PrismaOTPRepository(logger)

const validateOTPUseCase = new ValidateOTPUseCase(otpRepositoryGateway, logger)

const schemaValidator = new ZodSchemaValidator<z.infer<typeof validateOTPSchema.body>>(validateOTPSchema.body)

const validateOTPController = new ValidateOTPController(validateOTPUseCase, schemaValidator, logger)

export async function validateOTP(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await validateOTPController.execute({
    body: req.body as z.infer<typeof validateOTPSchema.body>,
  })

  return reply.status(status).send(body)
}
