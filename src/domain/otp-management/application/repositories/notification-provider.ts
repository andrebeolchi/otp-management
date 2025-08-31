import { Recipient } from '~/domain/otp-management/entities/value-objects/recipient'

export interface Content {
  subject: string
  body: string
}

export interface NotificationProvider {
  send(recipient: Recipient, content: Content): Promise<void>
}
