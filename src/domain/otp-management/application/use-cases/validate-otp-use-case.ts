import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

export interface ValidateOTPRequest {
  otp: string
  recipientType: 'email' | 'sms'
  recipientValue: string
}

export interface ValidateOTPResponse {
  isValid: boolean
  status: 'valid' | 'invalid' | 'expired'
}

export class ValidateOTPUseCase {
  constructor(private otpRepository: OTPRepository) {}

  async execute({ otp, recipientType, recipientValue }: ValidateOTPRequest): Promise<ValidateOTPResponse> {
    const recipient = Recipient.create({ type: recipientType, value: recipientValue })

    const existingOTP = await this.otpRepository.findValidByRecipient(recipient)

    if (!existingOTP) {
      return { isValid: false, status: 'invalid' }
    }

    if (existingOTP.token !== otp) {
      return { isValid: false, status: 'invalid' }
    }

    await this.otpRepository.invalidate(existingOTP)

    if (existingOTP.isExpired()) {
      return { isValid: false, status: 'expired' }
    }

    return { isValid: true, status: 'valid' }
  }
}
