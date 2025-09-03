import dotenv from 'dotenv'

dotenv.config()

interface Config {
  env: 'development' | 'production' | 'test'
  otp: {
    length: number
    expirationInMs: number
  }
  port: number | string
  twilio: {
    accountSid: string
    authToken: string
    phoneNumber: string
  }
  google: {
    email: string
    password: string
  }
}

export const config: Config = {
  env: (process.env.NODE_ENV as Config['env']) ?? 'development',
  otp: {
    length: process.env.OTP_LENGTH ? +process.env.OTP_LENGTH : 6,
    expirationInMs: process.env.OTP_EXPIRATION_IN_MS ? +process.env.OTP_EXPIRATION_IN_MS : 5 * 60 * 1000,
  },
  port: process.env.PORT ?? 3000,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER ?? '',
  },
  google: {
    email: process.env.GOOGLE_EMAIL ?? '',
    password: process.env.GOOGLE_PASSWORD ?? '',
  },
}
