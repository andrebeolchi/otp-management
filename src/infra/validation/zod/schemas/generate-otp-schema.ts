import { z } from 'zod'

export const generateOTPSchema = {
  summary: 'Generate OTP',
  description: 'Generate a One-Time Password (OTP) for a given recipient (email or SMS).',
  tags: ['OTP Management'],
  body: z.object({
    recipientType: z.enum(['email', 'sms']),
    recipientValue: z.string().min(1, 'Recipient value is required'),
  }),
  response: {
    201: z.object({ message: z.literal('OTP generated successfully') }),
    400: z.array(z.object({ message: z.string() })),
    500: z.array(z.object({ message: z.string() })),
  },
}
