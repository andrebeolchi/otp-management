export interface SchemaValidatorErrors {
  message: string
  path: string
}

export interface SchemaValidator<T> {
  execute(data: T): { data: T; errors: SchemaValidatorErrors[] }
}
