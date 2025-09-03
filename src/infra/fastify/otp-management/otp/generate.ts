import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { GenerateOTPUseCase } from '~/domain/otp-management/application/use-cases/generate-otp-use-case'

import { GenerateOTPController } from '~/adapters/controllers/otp/generate'

import { PrismaOTPRepository } from '~/adapters/gateways/database/otp/prisma-otp-repository'

import { PublisherNotificationProvider } from '~/infra/external/notification'
import { NodemailerEmailProvider } from '~/infra/external/notification/email/nodemailer-email-provider'
import { TwilioSMSProvider } from '~/infra/external/notification/sms/twilio-sms-provider'
import { LocalOTPProvider } from '~/infra/external/otp/local-otp-provider'

import { config } from '~/infra/config'
import { PinoLogger } from '~/infra/logger/pino'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { generateOTPSchema } from '~/infra/validation/zod/schemas/generate-otp-schema'

const logger = new PinoLogger()

const otpRepositoryGateway = new PrismaOTPRepository(logger)

const otpProvider = new LocalOTPProvider()

const emailProvider = new NodemailerEmailProvider(logger)
const smsProvider = new TwilioSMSProvider(logger)

const notificationProvider = new PublisherNotificationProvider(emailProvider, smsProvider)

const generateOTPUseCase = new GenerateOTPUseCase(
  otpRepositoryGateway,
  otpProvider,
  config.otp.length,
  config.otp.expirationInMs,
  notificationProvider,
  logger
)

const schemaValidator = new ZodSchemaValidator<z.infer<typeof generateOTPSchema.body>>(generateOTPSchema.body)

const generateOTPController = new GenerateOTPController(generateOTPUseCase, schemaValidator, logger)

export async function generateOTP(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await generateOTPController.execute({
    body: req.body as z.infer<typeof generateOTPSchema.body>,
  })

  return reply.status(status).send(body)
}
