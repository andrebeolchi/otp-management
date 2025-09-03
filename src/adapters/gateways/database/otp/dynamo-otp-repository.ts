import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { dynamodb } from '~/infra/database/dynamodb'

import { Logger } from '~/infra/logger'

export class DynamoOTPRepository implements OTPRepository {
  private tableName = process.env.DYNAMODB_TABLE || 'otp-table'

  constructor(private logger: Logger) {}

  async save(otp: OTPToken): Promise<void> {
    this.logger.debug('saving OTP token', { otpId: otp.id, recipientType: otp.recipient.type })
    await dynamodb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          id: otp.id,
          recipientType: otp.recipient.type,
          recipientValue: otp.recipient.value,
          token: otp.token,
          expiresAt: otp.expiresAt.toISOString(),
          createdAt: otp.createdAt.toISOString(),
          isValid: otp.isValid,
        },
      })
    )
    this.logger.debug('OTP token saved', { otpId: otp.id })
  }

  async findValidByRecipient(recipient: Recipient): Promise<OTPToken | null> {
    this.logger.debug('querying valid OTP by recipient', { recipientType: recipient.type })
    const params = {
      TableName: this.tableName,
      IndexName: 'idx_recipient_type_value',
      KeyConditionExpression: 'recipientType = :recipientType AND recipientValue = :recipientValue',
      FilterExpression: 'isValid = :isValid',
      ExpressionAttributeValues: {
        ':recipientType': recipient.type,
        ':recipientValue': recipient.value,
        ':isValid': true,
      },
      ScanIndexForward: false,
    }

    const result = await dynamodb.send(new QueryCommand(params))

    if (!result.Items || result.Items.length === 0) {
      this.logger.info('no valid OTP token found', { recipientType: recipient.type })
      return null
    }

    const otpRecord = result.Items[0]
    this.logger.info('valid OTP token found', { otpId: otpRecord.id })

    return OTPToken.create(
      {
        recipient: Recipient.create({
          type: otpRecord.recipientType,
          value: otpRecord.recipientValue,
        }),
        token: otpRecord.token,
        expiresAt: new Date(otpRecord.expiresAt),
        isValid: otpRecord.isValid,
        createdAt: new Date(otpRecord.createdAt),
      },
      otpRecord.id
    )
  }

  async invalidate(otp: OTPToken): Promise<void> {
    this.logger.debug('invalidating OTP token', { otpId: otp.id })
    const params = {
      TableName: this.tableName,
      Key: {
        id: otp.id,
      },
      UpdateExpression: 'SET isValid = :isValid, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':isValid': false,
        ':updatedAt': new Date().toISOString(),
      },
    }

    await dynamodb.send(new UpdateCommand(params))
    this.logger.info('OTP token invalidated', { otpId: otp.id })
  }
}
