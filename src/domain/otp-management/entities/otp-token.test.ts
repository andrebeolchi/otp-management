import { faker } from '@faker-js/faker'

import { OTPToken } from './otp-token'
import { Recipient } from './value-objects/recipient'

describe('[entity] otp token', () => {
  const recipient = Recipient.create({ type: 'email', value: faker.internet.email() })
  const token = '123456'
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10) // 10 minutes from now
  const isValid = true

  it('should create an OTPToken instance', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken).toBeInstanceOf(OTPToken)
    expect(otpToken.recipient).toEqual(recipient)
    expect(otpToken.token).toBe(token)
    expect(otpToken.expiresAt).toEqual(expiresAt)
    expect(otpToken.isValid).toBe(isValid)
    expect(otpToken.createdAt).toBeInstanceOf(Date)
  })

  it('should return true for isExpired if the current date is past expiresAt', () => {
    const expiredDate = new Date(Date.now() - 1000 * 60) // 1 minute ago
    const otpToken = OTPToken.create({ recipient, token, expiresAt: expiredDate, isValid })

    expect(otpToken.isExpired()).toBe(true)
  })

  it('should return false for isExpired if the current date is before expiresAt', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken.isExpired()).toBe(false)
  })

  it('should return the correct recipient', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken.recipient).toEqual(recipient)
  })

  it('should return the correct token', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken.token).toBe(token)
  })

  it('should return the correct expiresAt date', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken.expiresAt).toEqual(expiresAt)
  })

  it('should return the correct createdAt date', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken.createdAt).toBeInstanceOf(Date)
  })

  it('should return the correct isValid value', () => {
    const otpToken = OTPToken.create({ recipient, token, expiresAt, isValid })

    expect(otpToken.isValid).toBe(isValid)
  })
})
