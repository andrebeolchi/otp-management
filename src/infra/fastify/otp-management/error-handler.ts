import { FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod'

import { config } from '~/infra/config'

export const fastifyErrorHandler = (error: Error, req: FastifyRequest, reply: FastifyReply) => {
  if (config?.env === 'development') {
    console.error(error)
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send([
      {
        message: "Request doesn't match the schema",
        ...(config?.env === 'development' && {
          details: {
            issues: error.validation,
            method: req.method,
            url: req.url,
          },
        }),
      },
    ])
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send([
      {
        message: "Response doesn't match the schema",
        ...(config.env === 'development' && {
          details: {
            issues: error.cause.issues,
            method: error.method,
            url: error.url,
          },
        }),
      },
    ])
  }

  return reply.status(500).send([{ message: 'Internal server error' }])
}
