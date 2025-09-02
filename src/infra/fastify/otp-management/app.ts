import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import packageJson from 'root/package.json'

import { fastifyErrorHandler } from './error-handler'
import { healthCheckRoute } from './health-check'
import { otpManagementRoutes } from './otp'

export const app = fastify()

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(healthCheckRoute)
app.register(otpManagementRoutes)

app.setErrorHandler(fastifyErrorHandler)
