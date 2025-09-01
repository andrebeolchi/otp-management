import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { Content, NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'

export class PublisherNotificationProvider implements NotificationProvider {
  constructor(
    public emailProvider: NotificationProvider,
    public smsProvider: NotificationProvider
  ) {}

  async send(recipient: Recipient, content: Content) {
    if (recipient.type === 'email') {
      await this.emailProvider.send(recipient, content)
    }

    if (recipient.type === 'sms') {
      await this.smsProvider.send(recipient, content)
    }
  }
}
