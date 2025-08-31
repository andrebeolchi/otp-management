import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

export interface OTPRepository {
  save(otp: OTPToken): Promise<void>
  findValidByRecipient(recipient: Recipient): Promise<OTPToken | null>
  invalidate(otp: OTPToken): Promise<void>
}
