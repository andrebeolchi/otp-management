import { z } from 'zod'

import { SchemaValidator, SchemaValidatorErrors } from '~/adapters/controllers/interfaces/schema-validator'

export class ZodSchemaValidator<T> implements SchemaValidator<T> {
  constructor(private schema: z.ZodType) {}

  execute(value: T): { data: T; errors: SchemaValidatorErrors[] } {
    const { error, data } = this.schema.safeParse(value)

    if (error) {
      const errors: SchemaValidatorErrors[] = error.issues.map(issue => ({
        message: issue.message,
        path: issue.path?.toString(),
      }))

      return { data: data as T, errors }
    }

    return { data: data as T, errors: [] }
  }
}
