export const config = {
  otp: {
    length: process.env?.OTP_LENGTH ? +process.env?.OTP_LENGTH : 6,
    expirationInMs: process.env?.OTP_EXPIRATION_IN_MS ? +process.env?.OTP_EXPIRATION_IN_MS : 5 * 60 * 1000,
  },
  port: process.env?.PORT ?? 3000,
}
