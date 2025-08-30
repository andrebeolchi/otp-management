import { OTPToken } from '~/domain/otp-management/entities/otp-token'

export interface OTPRepository {
  save(otp: OTPToken): Promise<void>
}
