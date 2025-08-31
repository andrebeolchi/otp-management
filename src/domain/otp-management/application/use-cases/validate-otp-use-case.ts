import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

export interface ValidateOTPRequest {
  otp: string
  recipientType: 'email' | 'sms'
  recipientValue: string
}

export class ValidateOTPUseCase {
  constructor(private otpRepository: OTPRepository) {}

  async execute({ otp, recipientType, recipientValue }: ValidateOTPRequest): Promise<boolean> {
    const recipient = Recipient.create({ type: recipientType, value: recipientValue })

    const existingOTP = await this.otpRepository.findValidByRecipient(recipient)

    if (!existingOTP) {
      return false
    }

    if (existingOTP.token !== otp) {
      return false
    }

    await this.otpRepository.invalidate(existingOTP)

    return !existingOTP.isExpired()
  }
}
