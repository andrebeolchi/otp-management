import { mock, MockProxy } from 'jest-mock-extended'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { Logger } from '~/infra/logger'

import { ValidateOTPUseCase } from './validate-otp-use-case'

describe('[use-cases] validate otp', () => {
  let otpRepository: MockProxy<OTPRepository>
  let validateOTPUseCase: ValidateOTPUseCase
  let logger: MockProxy<Logger>

  beforeEach(() => {
    otpRepository = mock<OTPRepository>()
    logger = mock<Logger>()
    validateOTPUseCase = new ValidateOTPUseCase(otpRepository, logger)
  })

  it('should return false if no valid OTP exists for the recipient', async () => {
    otpRepository.findValidByRecipient.mockResolvedValue(null)

    const result = await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(result.isValid).toBe(false)
    expect(result.status).toBe('invalid')
  })

  it('should return false if the OTP does not match', async () => {
    const recipient = Recipient.create({ type: 'email', value: 'test@example.com' })
    const existingOTP = OTPToken.create({
      token: '654321',
      recipient,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      isValid: true,
    })

    otpRepository.findValidByRecipient.mockResolvedValue(existingOTP)

    const result = await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(result.isValid).toBe(false)
    expect(result.status).toBe('invalid')
  })

  it('should return false if the OTP is expired', async () => {
    const recipient = Recipient.create({ type: 'email', value: 'test@example.com' })
    const existingOTP = OTPToken.create({
      token: '123456',
      recipient,
      expiresAt: new Date(Date.now() - 1000 * 60 * 5),
      isValid: true,
    })

    otpRepository.findValidByRecipient.mockResolvedValue(existingOTP)

    const result = await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(result.isValid).toBe(false)
    expect(result.status).toBe('expired')
  })

  it('should return true if the OTP is valid and not expired', async () => {
    const recipient = Recipient.create({ type: 'email', value: 'test@example.com' })
    const existingOTP = OTPToken.create({
      token: '123456',
      recipient,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      isValid: true,
    })

    otpRepository.findValidByRecipient.mockResolvedValue(existingOTP)

    const result = await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(result.isValid).toBe(true)
    expect(result.status).toBe('valid')
  })

  it('should invalidate if the OTP is expired', async () => {
    const recipient = Recipient.create({ type: 'email', value: 'test@example.com' })
    const existingOTP = OTPToken.create({
      token: '123456',
      recipient,
      expiresAt: new Date(Date.now() - 1000 * 60 * 5),
      isValid: true,
    })

    otpRepository.findValidByRecipient.mockResolvedValue(existingOTP)

    await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(otpRepository.invalidate).toHaveBeenCalledWith(existingOTP)
  })

  it('should invalidate if the OTP is valid and not expired', async () => {
    const recipient = Recipient.create({ type: 'email', value: 'test@example.com' })
    const existingOTP = OTPToken.create({
      token: '123456',
      recipient,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      isValid: true,
    })

    otpRepository.findValidByRecipient.mockResolvedValue(existingOTP)

    await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(otpRepository.invalidate).toHaveBeenCalledWith(existingOTP)
  })
})
