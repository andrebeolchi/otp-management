import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function healthCheckRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/health',
    schema: {
      description: 'Health check endpoint',
      tags: ['health-check'],
      response: {
        200: z.object({
          status: z.literal('ok'),
        }),
      },
    },
    handler: async (_request, reply) => {
      return reply.status(200).send({ status: 'ok' })
    },
  })
}
