import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

import { Content, NotificationProvider } from '~/domain/otp-management/application/repositories/notification-provider'

export class OneSignalEmailProvider implements NotificationProvider {
  async send(recipient: Recipient, _content: Content): Promise<void> {
    try {
      console.log(`Email sent to ${recipient.value} via OneSignal: ${_content.body}`)
    } catch (error) {
      console.error('Failed to send email via OneSignal:', error)
      throw new Error('Failed to send email')
    }
  }
}
