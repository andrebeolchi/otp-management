import { PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { OTPToken } from '~/domain/otp-management/entities/otp-token'

import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { dynamodb } from '~/infra/database/dynamodb'

export class DynamoOTPRepository implements OTPRepository {
  private tableName = process.env.DYNAMODB_TABLE || 'otp-table'

  constructor() {}

  async save(otp: OTPToken): Promise<void> {
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
  }

  async findValidByRecipient(recipient: Recipient): Promise<OTPToken | null> {
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
      return null
    }

    const otpRecord = result.Items[0]

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
  }
}
