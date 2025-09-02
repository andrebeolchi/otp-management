import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { prisma } from '~/infra/database/prisma'

export class PrismaOTPRepository implements OTPRepository {
  async save(otp: OTPToken): Promise<void> {
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
      return null
    }

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
    await prisma.otpToken.update({
      where: {
        id: otp.id,
      },
      data: {
        isValid: false,
      },
    })
  }
}
