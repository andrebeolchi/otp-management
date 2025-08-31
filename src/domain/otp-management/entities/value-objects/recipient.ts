import { ValidationError } from '~/domain/commons/errors/validation'
import { ValueObject } from '~/domain/commons/value-object'

interface RecipientProps {
  type: 'email' | 'sms'
  value: string
}

export class Recipient extends ValueObject<RecipientProps> {
  static create(props: RecipientProps) {
    const recipient = new Recipient(props)
    if (!recipient.type || recipient.type.trim() === '') {
      throw new ValidationError('Recipient type is required')
    }

    if (['email', 'sms'].includes(recipient.type.trim()) === false) {
      throw new ValidationError('Invalid recipient type')
    }

    if (!recipient.value || recipient.value.trim() === '') {
      throw new ValidationError('Recipient value is required')
    }
    return recipient
  }

  get type() {
    return this.props.type
  }

  get value() {
    return this.props.value
  }
}
