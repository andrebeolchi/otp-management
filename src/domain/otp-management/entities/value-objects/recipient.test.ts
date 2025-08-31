import { faker } from '@faker-js/faker'

import { ValidationError } from '~/domain/commons/errors/validation'

import { Recipient } from './recipient'

describe('[value-object] recipient', () => {
  it('should create a valid email recipient', () => {
    const recipient = Recipient.create({ type: 'email', value: 'test@example.com' })
    expect(recipient.type).toBe('email')
    expect(recipient.value).toBe('test@example.com')
  })

  it('should create a valid SMS recipient', () => {
    const recipient = Recipient.create({ type: 'sms', value: '1234567890' })
    expect(recipient.type).toBe('sms')
    expect(recipient.value).toBe('1234567890')
  })

  it('should throw a ValidationError for an invalid recipient type', () => {
    //@ts-expect-error testing invalid type
    expect(() => Recipient.create({ type: 'invalid', value: 'test@example.com' })).toThrow(ValidationError)

    //@ts-expect-error testing invalid type
    expect(() => Recipient.create({ type: 'invalid', value: 'test@example.com' })).toThrow('Invalid recipient type')
  })

  it('should throw a ValidationError for a missing recipient type', () => {
    //@ts-expect-error testing missing type
    expect(() => Recipient.create({ value: faker.internet.email() })).toThrow(ValidationError)

    //@ts-expect-error testing missing type
    expect(() => Recipient.create({ value: faker.internet.email() })).toThrow('Recipient type is required')
  })

  it('should throw a ValidationError for an empty recipient value', () => {
    expect(() => Recipient.create({ type: 'email', value: '' })).toThrow(ValidationError)
    expect(() => Recipient.create({ type: 'email', value: '' })).toThrow('Recipient value is required')
  })

  it('should throw a ValidationError for a recipient value with only spaces', () => {
    expect(() => Recipient.create({ type: 'sms', value: '   ' })).toThrow(ValidationError)
    expect(() => Recipient.create({ type: 'sms', value: '   ' })).toThrow('Recipient value is required')
  })

  it('should throw a ValidationError for a missing recipient value', () => {
    //@ts-expect-error testing missing value
    expect(() => Recipient.create({ type: 'email' })).toThrow(ValidationError)

    //@ts-expect-error testing missing value
    expect(() => Recipient.create({ type: 'email' })).toThrow('Recipient value is required')
  })
})
