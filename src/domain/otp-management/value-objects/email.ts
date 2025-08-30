import { z } from 'zod'

import { ValidationError } from '~/domain/commons/errors/validation'

export const schema = z.email({ message: 'Invalid email address' }).transform(email => email.toLowerCase())

export class Email {
  private constructor(private readonly _value: string) {}

  public static create(email: string): Email {
    const { success, data, error } = schema.safeParse(email)
    if (!success) throw new ValidationError(error.message)
    return new Email(data)
  }

  public get value(): string {
    return this._value
  }

  public equals(other: Email): boolean {
    return this._value === other._value
  }
}
