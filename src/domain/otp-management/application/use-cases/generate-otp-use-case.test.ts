import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'
import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { GenerateOTPRequest, GenerateOTPUseCase } from './generate-otp-use-case'

describe('[use-cases] generate otp', () => {
  const OTP_LENGTH = 6
  const OTP_EXPIRATION_IN_MS = 5 * 60 * 1000

  let otpRepository: MockProxy<OTPRepository>
  let otpProvider: MockProxy<OTPProvider>
  let generateOTPUseCase: GenerateOTPUseCase
  let notificationProvider: MockProxy<NotificationProvider>

  beforeAll(() => {
    otpRepository = mock<OTPRepository>()
    otpProvider = mock<OTPProvider>()
    notificationProvider = mock<NotificationProvider>()

    generateOTPUseCase = new GenerateOTPUseCase(
      otpRepository,
      otpProvider,
      OTP_LENGTH,
      OTP_EXPIRATION_IN_MS,
      notificationProvider
    )
  })

  it('should generate a new OTP when no valid OTP exists', async () => {
    otpRepository.findValidByRecipient.mockResolvedValue(null)
    otpProvider.generate.mockResolvedValue('123456')

    const request: GenerateOTPRequest = {
      recipientType: 'email',
      recipientValue: faker.internet.email(),
    }

    await generateOTPUseCase.execute(request)

    expect(notificationProvider.send).toHaveBeenCalledTimes(1)
    expect(notificationProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'email',
        value: request.recipientValue,
      }),
      expect.objectContaining({
        subject: 'Your OTP Code',
        body: 'Your OTP code is: 123456',
      })
    )
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

    await generateOTPUseCase.execute(request)

    expect(otpRepository.invalidate).toHaveBeenCalledWith(existingOTP)
  })
})
