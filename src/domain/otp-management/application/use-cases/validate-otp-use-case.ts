import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { Logger } from '~/infra/logger'

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
  constructor(
    private otpRepository: OTPRepository,
    private logger: Logger
  ) {}

  async execute({ otp, recipientType, recipientValue }: ValidateOTPRequest): Promise<ValidateOTPResponse> {
    const recipient = Recipient.create({ type: recipientType, value: recipientValue })

    const existingOTP = await this.otpRepository.findValidByRecipient(recipient)

    if (!existingOTP) {
      this.logger.info('no valid OTP found for recipient', { recipientType: recipient.type, otp })
      return { isValid: false, status: 'invalid' }
    }

    if (existingOTP.token !== otp) {
      this.logger.info('provided OTP does not match the stored OTP', { recipientType: recipient.type, otp })
      return { isValid: false, status: 'invalid' }
    }

    await this.otpRepository.invalidate(existingOTP)

    if (existingOTP.isExpired()) {
      this.logger.info('provided OTP is expired', { recipientType: recipient.type, otp })
      return { isValid: false, status: 'expired' }
    }

    this.logger.info('provided OTP is valid', { recipientType: recipient.type, otp })
    return { isValid: true, status: 'valid' }
  }
}
