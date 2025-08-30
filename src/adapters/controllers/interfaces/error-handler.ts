import { ZodError } from 'zod'

import { CustomError } from '~/domain/commons/errors/custom'

export function errorHandler(err: unknown) {
  const error = err as Error

  if (process.env.NODE_ENV === 'development') {
    console.error(error)
  }

  if (error instanceof ZodError) {
    return {
      body: [...error.issues.map(issue => ({ message: issue.message, path: issue.path?.toString() }))],
      status: 400,
    }
  }

  if (error instanceof CustomError) {
    return {
      body: [{ message: error.message }],
      status: error.status || 400,
    }
  }

  return {
    body: [{ message: 'Internal server error' }],
    status: 500,
  }
}
