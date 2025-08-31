import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

export interface GenerateOTPRequest {
  recipientType: 'email' | 'sms'
  recipientValue: string
}

export class GenerateOTPUseCase {
  constructor(
    private otpRepository: OTPRepository,
    private otpProvider: OTPProvider,
    private otpLength: number,
    private otpExpirationInMs: number
  ) {}

  async execute(request: GenerateOTPRequest): Promise<OTPToken> {
    const recipient = Recipient.create({
      type: request.recipientType,
      value: request.recipientValue,
    })

    const existingOTP = await this.otpRepository.findValidByRecipient(recipient)

    if (existingOTP) {
      await this.otpRepository.invalidate(existingOTP)
    }

    const otpCode = await this.otpProvider.generate({ length: this.otpLength })

    const otpToken = OTPToken.create({
      token: otpCode,
      recipient,
      expiresAt: new Date(Date.now() + this.otpExpirationInMs),
      isValid: true,
    })

    await this.otpRepository.save(otpToken)

    return otpToken
  }
}
