import { OTPTokenProps } from '~/domain/otp-management/entities/otp-token'

export interface OTPRepository {
  save(otp: OTPTokenProps): Promise<void>
  findByEmail(email: string): Promise<OTPTokenProps | null>
  deleteByEmail(email: string): Promise<void>
}
