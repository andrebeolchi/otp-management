import twilio from 'twilio'

import { config } from '~/infra/config'

const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken)

export { twilioClient }
