import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { HashProvider } from '~/domain/otp-management/application/repositories/hash-provider'
import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

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
    const existingOTP = await this.otpRepository.findByEmail(email)

    if (existingOTP) {
      await this.otpRepository.deleteByEmail(existingOTP.email)
    }

    const otp = await this.otpProvider.generate({ length: OTP_LENGTH })
    const hashedOTP = await this.hashProvider.hash(otp)
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_IN_MS)

    const otpToken = OTPToken.create({
      email,
      hashedOTP,
      otp,
      expiresAt,
    })

    await this.otpRepository.save(otpToken)

    return otpToken
  }
}
