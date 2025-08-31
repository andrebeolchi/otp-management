import { LocalOTPProvider } from './local-otp-provider'

describe('[infra] local otp provider', () => {
  describe('generate', () => {
    it('should generate an OTP of the specified length', async () => {
      const otpProvider = new LocalOTPProvider()
      const length = 6
      const otp = await otpProvider.generate({ length })

      expect(otp).toHaveLength(length)
      expect(Number(otp)).not.toBeNaN()
    })

    it('should generate different OTPs on subsequent calls', async () => {
      const otpProvider = new LocalOTPProvider()
      const length = 6
      const otp1 = await otpProvider.generate({ length })
      const otp2 = await otpProvider.generate({ length })

      expect(otp1).not.toEqual(otp2)
    })
  })
})
