import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { generateOTPSchema } from '~/infra/validation/zod/schemas/generate-otp-schema'
import { validateOTPSchema } from '~/infra/validation/zod/schemas/validate-otp-schema'

import { generateOTP } from './generate'
import { validateOTP } from './validate'

export async function otpManagementRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/otp',
    schema: generateOTPSchema,
    handler: generateOTP,
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/otp/validate',
    schema: validateOTPSchema,
    handler: validateOTP,
  })
}
