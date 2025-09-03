import { ExternalServiceError } from '~/domain/commons/errors/external-service'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { Content, NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'

import { twilioClient } from '~/infra/external/notification/twilio'

import { config } from '~/infra/config'
import { Logger } from '~/infra/logger'

export class TwilioSMSProvider implements NotificationProvider {
  constructor(private logger: Logger) {}

  async send(recipient: Recipient, content: Content): Promise<void> {
    try {
      const response = await twilioClient.messages.create({
        body: `${content.subject}: ${content.body}`,
        from: config.twilio.phoneNumber,
        to: recipient.value,
      })

      if (response.errorCode !== null) {
        this.logger.error('Twilio SMS sending failed', { error: response.errorMessage, code: response.errorCode })
        throw new ExternalServiceError(`Failed to send SMS via Twilio: ${response.errorMessage}`)
      }
    } catch (error) {
      this.logger.error('Twilio SMS sending failed due to an exception', { error })
      throw new ExternalServiceError('Failed to send SMS via Twilio')
    }
  }
}
