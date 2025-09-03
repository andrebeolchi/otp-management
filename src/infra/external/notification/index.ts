import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { Content, NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'

export class PublisherNotificationProvider implements NotificationProvider {
  constructor(
    public emailProvider: NotificationProvider,
    public smsProvider: NotificationProvider
  ) {}

  async send(recipient: Recipient, content: Content) {
    const fn = {
      email: this.emailProvider.send.bind(this.emailProvider),
      sms: this.smsProvider.send.bind(this.smsProvider),
    }[recipient.type]

    await fn(recipient, content)
  }
}
