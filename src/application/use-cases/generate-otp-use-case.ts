import { Email } from '~/domain/otp-management/value-objects/email'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { HashProvider } from '~/application/repositories/hash-provider'
import { OTPProvider } from '~/application/repositories/otp-provider'
import { OTPRepository } from '~/application/repositories/otp-repository'

const OTP_LENGTH = 6
const OTP_EXPIRATION_IN_MS = 30 * 1000 // 30 seconds

export interface GenerateOTPRequest {
  email: string
}

export class GenerateOTPUseCase {
  constructor(
    private otpRepository: OTPRepository,
    private otpProvider: OTPProvider,
    private hashProvider: HashProvider
  ) {}

  async execute({ email }: GenerateOTPRequest): Promise<OTPToken> {
    const rawOTP = await this.otpProvider.generate({ length: OTP_LENGTH })

    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_IN_MS)

    const hashedOTP = await this.hashProvider.hash(rawOTP)

    const otpToken = OTPToken.create({
      email: Email.create(email),
      hashedOTP,
      otp: rawOTP,
      expiresAt,
    })

    await this.otpRepository.save(otpToken)

    return otpToken
  }
}
