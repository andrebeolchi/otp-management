import { mock, MockProxy } from 'jest-mock-extended'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { ValidateOTPUseCase } from './validate-otp-use-case'

describe('[use-cases] validate otp', () => {
  let otpRepository: MockProxy<OTPRepository>
  let validateOTPUseCase: ValidateOTPUseCase

  beforeEach(() => {
    otpRepository = mock<OTPRepository>()
    validateOTPUseCase = new ValidateOTPUseCase(otpRepository)
  })

  it('should return false if no valid OTP exists for the recipient', async () => {
    otpRepository.findValidByRecipient.mockResolvedValue(null)

    const result = await validateOTPUseCase.execute({
      otp: '123456',
      recipientType: 'email',
      recipientValue: 'test@example.com',
    })

    expect(result).toBe(false)
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

    expect(result).toBe(false)
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

    expect(result).toBe(false)
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

    expect(result).toBe(true)
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
