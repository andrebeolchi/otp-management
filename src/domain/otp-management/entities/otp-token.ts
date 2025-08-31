import { Entity } from '~/domain/commons/entity'

export interface OTPTokenProps {
  email: string
  otp: string
  hashedOTP: string
  expiresAt: Date
  createdAt: Date
}

export class OTPToken extends Entity<OTPTokenProps> {
  static create(props: Omit<OTPTokenProps, 'createdAt'>, id?: string) {
    const otpToken = new OTPToken({ ...props, createdAt: new Date() }, id)
    return otpToken
  }

  public get email(): string {
    return this.props.email
  }

  public get otp(): string {
    return this.props.otp
  }

  public get hashedOTP(): string {
    return this.props.hashedOTP
  }

  public get expiresAt(): Date {
    return this.props.expiresAt
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }
}
