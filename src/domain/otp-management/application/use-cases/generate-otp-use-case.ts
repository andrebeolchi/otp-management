import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'
import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { Logger } from '~/infra/logger'

export interface GenerateOTPRequest {
  recipientType: 'email' | 'sms'
  recipientValue: string
}

export class GenerateOTPUseCase {
  constructor(
    private otpRepository: OTPRepository,
    private otpProvider: OTPProvider,
    private otpLength: number,
    private otpExpirationInMs: number,
    private notificationProvider: NotificationProvider,
    private logger: Logger
  ) {}

  async execute(request: GenerateOTPRequest) {
    this.logger.debug('starting OTP generation', { recipientType: request.recipientType })

    const recipient = Recipient.create({
      type: request.recipientType,
      value: request.recipientValue,
    })

    const existingOTP = await this.otpRepository.findValidByRecipient(recipient)

    if (existingOTP) {
      this.logger.info('invalidating existing OTP for recipient', { recipientType: recipient.type })
      await this.otpRepository.invalidate(existingOTP)
    }

    const otpCode = await this.otpProvider.generate({ length: this.otpLength })

    this.logger.debug('OTP code generated, creating OTP token entity', { recipientType: recipient.type, otp: otpCode })
    const otpToken = OTPToken.create({
      token: otpCode,
      recipient,
      expiresAt: new Date(Date.now() + this.otpExpirationInMs),
      isValid: true,
    })

    await this.otpRepository.save(otpToken)
    this.logger.debug('otp saved successfully, preparing to send notification', {
      recipientType: recipient.type,
      otp: otpCode,
    })

    await this.notificationProvider.send(recipient, {
      subject: 'Your OTP Code',
      body: `Your OTP code is: ${otpCode}`,
    })
  }
}
