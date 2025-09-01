import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { generateOTPSchema } from '~/infra/validation/zod/schemas/generate-otp-schema'

import { generateOTP } from './generate'

export async function otpManagementRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/otp',
    schema: generateOTPSchema,
    handler: generateOTP,
  })
}
