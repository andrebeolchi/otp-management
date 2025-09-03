import { ExternalServiceError } from '~/domain/commons/errors/external-service'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { Content, NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'

import { nodemailerClient } from '~/infra/external/notification/nodemailer'

import { Logger } from '~/infra/logger'

export class NodemailerEmailProvider implements NotificationProvider {
  constructor(private logger: Logger) {}

  async send(recipient: Recipient, content: Content): Promise<void> {
    try {
      this.logger.info('sending email via Nodemailer')
      const result = await nodemailerClient.sendMail({
        to: recipient.value,
        subject: content.subject,
        text: content.body,
      })

      if (result.rejected.length > 0) {
        this.logger.error('Nodemailer email sending failed', { rejected: result.rejected })
        throw new ExternalServiceError(`Failed to send email via Nodemailer to: ${result.rejected.join(', ')}`)
      }

      this.logger.info('Nodemailer email sent successfully', { messageId: result.messageId })
    } catch (error) {
      this.logger.error('Nodemailer email sending failed due to an exception', { error })
      throw new ExternalServiceError('Failed to send email via Nodemailer')
    }
  }
}
