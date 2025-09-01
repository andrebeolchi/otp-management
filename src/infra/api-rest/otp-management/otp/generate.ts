import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { GenerateOTPUseCase } from '~/domain/otp-management/application/use-cases/generate-otp-use-case'

import { GenerateOTPController } from '~/adapters/controllers/otp/generate'

import { PrismaOTPRepository } from '~/adapters/gateways/database/otp/prisma-otp-repository'

import { OneSignalSMSProvider } from '~/infra/external/notification/onesignal/onesignal-sms-provider'
import { LocalOTPProvider } from '~/infra/external/otp/local-otp-provider'

import { config } from '~/infra/config'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { generateOTPSchema } from '~/infra/validation/zod/schemas/generate-otp-schema'

const otpRepositoryGateway = new PrismaOTPRepository()

const otpProvider = new LocalOTPProvider()

const notificationProvider = new OneSignalSMSProvider()

const generateOTPUseCase = new GenerateOTPUseCase(
  otpRepositoryGateway,
  otpProvider,
  config.otp.length,
  config.otp.expirationInMs,
  notificationProvider
)

const schemaValidator = new ZodSchemaValidator<z.infer<typeof generateOTPSchema.body>>(generateOTPSchema.body)

const generateOTPController = new GenerateOTPController(generateOTPUseCase, schemaValidator)

export async function generateOTP(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await generateOTPController.execute({
    body: req.body as z.infer<typeof generateOTPSchema.body>,
  })

  return reply.status(status).send(body)
}
