import { z } from 'zod'

export const validateOTPSchema = {
  summary: 'Validate OTP',
  description: 'Validate a One-Time Password (OTP) for a given recipient (email or SMS).',
  tags: ['OTP Management'],
  body: z.object({
    recipientType: z.enum(['email', 'sms']),
    recipientValue: z.string().min(1, 'Recipient value is required'),
    otp: z.string().min(1, 'OTP is required'),
  }),
  response: {
    200: z.object({ isValid: z.literal(true) }),
    400: z
      .object({ message: z.literal('Invalid OTP'), isValid: z.literal(false) })
      .or(z.array(z.object({ message: z.string() }))),
    410: z.object({ message: z.literal('OTP has expired'), isValid: z.literal(false) }),
    500: z.array(z.object({ message: z.string() })),
  },
}
