import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { prisma } from '~/infra/database/prisma'

import { Logger } from '~/infra/logger'

export class PrismaOTPRepository implements OTPRepository {
  constructor(private logger: Logger) {}

  async save(otp: OTPToken): Promise<void> {
    this.logger.debug('saving OTP token to database', { otpId: otp.id, recipientType: otp.recipient.type })
    await prisma.otpToken.create({
      data: {
        id: otp.id,
        recipientType: otp.recipient.type,
        recipientValue: otp.recipient.value,
        token: otp.token,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt,
        isValid: otp.isValid,
      },
    })
  }

  async findValidByRecipient(recipient: Recipient): Promise<OTPToken | null> {
    this.logger.debug('fetching valid OTP token from database', { recipientType: recipient.type })
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        recipientType: recipient.type,
        recipientValue: recipient.value,
        isValid: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!otpRecord) {
      this.logger.debug('no valid OTP token found for recipient', { recipientType: recipient.type })
      return null
    }

    this.logger.debug('valid OTP found for recipient', { recipientType: recipient.type })
    return OTPToken.create(
      {
        recipient: Recipient.create({
          type: otpRecord.recipientType,
          value: otpRecord.recipientValue,
        }),
        token: otpRecord.token,
        expiresAt: otpRecord.expiresAt,
        isValid: otpRecord.isValid,
        createdAt: otpRecord.createdAt,
      },
      otpRecord.id
    )
  }

  async invalidate(otp: OTPToken): Promise<void> {
    this.logger.debug('invalidating OTP token in database', { otpId: otp.id })
    await prisma.otpToken.update({
      where: {
        id: otp.id,
      },
      data: {
        isValid: false,
      },
    })
    this.logger.debug('OTP token invalidated', { otpId: otp.id })
  }
}
