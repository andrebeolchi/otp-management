import { ExternalServiceError } from '~/domain/commons/errors/external-service'

import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { Content, NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'

import { nodemailerClient } from '~/infra/external/notification/nodemailer'

export class NodemailerEmailProvider implements NotificationProvider {
  async send(recipient: Recipient, content: Content): Promise<void> {
    try {
      await nodemailerClient.sendMail({
        to: recipient.value,
        subject: content.subject,
        text: content.body,
      })
    } catch {
      throw new ExternalServiceError('Failed to send email via Nodemailer')
    }
  }
}
