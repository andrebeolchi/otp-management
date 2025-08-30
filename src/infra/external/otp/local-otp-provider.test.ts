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

  describe('compare', () => {
    it('should return true if values are the same', async () => {
      const otpProvider = new LocalOTPProvider()
      const first = '123456'
      const second = '123456'

      const result = await otpProvider.compare(first, second)

      expect(result).toBe(true)
    })

    it('should return false if values are different', async () => {
      const otpProvider = new LocalOTPProvider()
      const first = '123456'
      const second = '654321'

      const result = await otpProvider.compare(first, second)

      expect(result).toBe(false)
    })
  })
})
