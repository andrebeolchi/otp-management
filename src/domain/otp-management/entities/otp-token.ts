import { Entity } from '~/domain/commons/entity'

import { Recipient } from './value-objects/recipient'

interface OTPTokenProps {
  recipient: Recipient
  token: string
  expiresAt: Date
  isValid: boolean
  createdAt?: Date
}

export class OTPToken extends Entity<OTPTokenProps> {
  static create(props: OTPTokenProps, id?: string) {
    const otpToken = new OTPToken({ ...props, createdAt: props.createdAt ?? new Date() }, id)
    return otpToken
  }

  public get recipient(): Recipient {
    return this.props.recipient
  }

  public get token(): string {
    return this.props.token
  }

  public get expiresAt(): Date {
    return this.props.expiresAt
  }

  public get createdAt(): Date {
    return this.props.createdAt as Date
  }

  public get isValid(): boolean {
    return this.props.isValid
  }

  public isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }
}
