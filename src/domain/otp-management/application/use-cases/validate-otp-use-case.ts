import { HashProvider } from '~/domain/otp-management/application/repositories/hash-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

export interface ValidateOTPRequest {
  email: string
  otp: string
}

export class ValidateOTPUseCase {
  constructor(
    private otpRepository: OTPRepository,
    private hashProvider: HashProvider
  ) {}

  async execute({ email, otp }: ValidateOTPRequest): Promise<boolean> {
    const existingOTP = await this.otpRepository.findByEmail(email)

    if (!existingOTP) {
      return false
    }

    const isOTPValid = await this.hashProvider.compare(otp, existingOTP.hashedOTP)

    if (!isOTPValid) {
      return false
    }

    const isOTPExpired = existingOTP.expiresAt < new Date()

    if (isOTPExpired) {
      await this.otpRepository.deleteByEmail(email)
      return false
    }

    await this.otpRepository.deleteByEmail(email)
    return true
  }
}
