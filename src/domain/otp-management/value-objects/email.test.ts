import { ValidationError } from '~/domain/commons/errors/validation'

import { Email } from './email'

describe('[value-object] email', () => {
  describe('create', () => {
    it('should create an email with valid email address', () => {
      const email = Email.create('test@example.com')
      expect(email.value).toBe('test@example.com')
    })

    it('should convert email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM')
      expect(email.value).toBe('test@example.com')
    })

    it('should throw ValidationError for invalid email format', () => {
      expect(() => Email.create('invalid-email')).toThrow(ValidationError)
    })

    it('should throw ValidationError for empty string', () => {
      expect(() => Email.create('')).toThrow(ValidationError)
    })

    it('should throw ValidationError for email without domain', () => {
      expect(() => Email.create('test@')).toThrow(ValidationError)
    })

    it('should throw ValidationError for email without @', () => {
      expect(() => Email.create('testexample.com')).toThrow(ValidationError)
    })
  })

  describe('value', () => {
    it('should return the email value', () => {
      const email = Email.create('test@example.com')
      expect(email.value).toBe('test@example.com')
    })
  })

  describe('equals', () => {
    it('should return true for same email addresses', () => {
      const email1 = Email.create('test@example.com')
      const email2 = Email.create('test@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return true for emails with different cases', () => {
      const email1 = Email.create('TEST@EXAMPLE.COM')
      const email2 = Email.create('test@example.com')
      expect(email1.equals(email2)).toBe(true)
    })

    it('should return false for different email addresses', () => {
      const email1 = Email.create('test1@example.com')
      const email2 = Email.create('test2@example.com')
      expect(email1.equals(email2)).toBe(false)
    })
  })
})
