import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { GenerateOTPRequest, GenerateOTPUseCase } from './generate-otp-use-case'

describe('[use-cases] generate otp', () => {
  const OTP_LENGTH = 6
  const OTP_EXPIRATION_IN_MS = 5 * 60 * 1000

  let otpRepository: MockProxy<OTPRepository>
  let otpProvider: MockProxy<OTPProvider>
  let generateOTPUseCase: GenerateOTPUseCase

  beforeAll(() => {
    otpRepository = mock<OTPRepository>()
    otpProvider = mock<OTPProvider>()

    generateOTPUseCase = new GenerateOTPUseCase(otpRepository, otpProvider, OTP_LENGTH, OTP_EXPIRATION_IN_MS)
  })

  it('should generate a new OTP when no valid OTP exists', async () => {
    otpRepository.findValidByRecipient.mockResolvedValue(null)
    otpProvider.generate.mockResolvedValue('123456')

    const request: GenerateOTPRequest = {
      recipientType: 'email',
      recipientValue: faker.internet.email(),
    }

    const result = await generateOTPUseCase.execute(request)

    expect(result.token).toBe('123456')
    expect(result.recipient.type).toBe('email')
    expect(result.recipient.value).toBe(request.recipientValue)
    expect(result.isValid).toBe(true)
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })

  it('should invalidate an existing OTP before generating a new one', async () => {
    const recipient = Recipient.create({
      type: 'email',
      value: faker.internet.email(),
    })

    const existingOTP = OTPToken.create({
      token: '654321',
      recipient,
      isValid: true,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    })

    otpRepository.findValidByRecipient.mockResolvedValue(existingOTP)
    otpProvider.generate.mockResolvedValue('123456')

    const request: GenerateOTPRequest = {
      recipientType: 'email',
      recipientValue: recipient.value,
    }

    const result = await generateOTPUseCase.execute(request)

    expect(otpRepository.invalidate).toHaveBeenCalledWith(existingOTP)
    expect(result.token).toBe('123456')
    expect(result.recipient.type).toBe('email')
    expect(result.recipient.value).toBe(request.recipientValue)
    expect(result.isValid).toBe(true)
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })
})
