import { Email } from '~/domain/otp-management/value-objects/email'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPProvider } from '~/application/repositories/otp-provider'
import { OTPRepository } from '~/application/repositories/otp-repository'

const OTP_LENGTH = 6
const OTP_EXPIRATION_IN_MS = 30 * 1000 // 30 seconds

export interface GenerateOTPRequest {
  email: string
}

export interface GenerateOTPResponse {
  otp: string
}

export class GenerateOTPUseCase {
  constructor(
    private otpRepository: OTPRepository,
    private otpProvider: OTPProvider
  ) {}

  async execute({ email }: GenerateOTPRequest): Promise<GenerateOTPResponse> {
    const otp = await this.otpProvider.generate({ length: OTP_LENGTH })

    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_IN_MS)

    const otpToken = OTPToken.create({
      email: Email.create(email),
      otp,
      expiresAt,
    })

    await this.otpRepository.save(otpToken)

    return { otp }
  }
}
