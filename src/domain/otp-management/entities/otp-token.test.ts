import { Email } from '~/domain/otp-management/value-objects/email'

import { OTPToken } from './otp-token'

describe('[entity] otp token', () => {
  describe('create', () => {
    it('should create an otp token', () => {
      const email = Email.create('test@example.com')
      const otp = '123456'
      const expiresAt = new Date(Date.now() + 1000 * 60)

      const token = OTPToken.create({ email, otp, expiresAt })

      expect(token.id).toBeTruthy()
      expect(token.email.value).toBe('test@example.com')
      expect(token.otp).toBe(otp)
      expect(token.expiresAt).toBe(expiresAt)
      expect(token.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('isExpired', () => {
    it('should return false if token is not expired', () => {
      const email = Email.create('test@example.com')
      const otp = '123456'
      const expiresAt = new Date(Date.now() + 1000 * 60)

      const token = OTPToken.create({ email, otp, expiresAt })
      expect(token.isExpired()).toBe(false)
    })

    it('should return true if token is expired', () => {
      const email = Email.create('test@example.com')
      const otp = '123456'
      const pastDate = new Date(Date.now() - 1000 * 60)

      const token = OTPToken.create({ email, otp, expiresAt: pastDate })
      expect(token.isExpired()).toBe(true)
    })
  })
})
