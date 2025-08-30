import { OTPProvider } from '~/application/repositories/otp-provider'

export class LocalOTPProvider implements OTPProvider {
  async generate({ length }: { length: number }): Promise<string> {
    const min = 10 ** (length - 1)
    const max = 10 ** length - 1
    return Math.floor(min + Math.random() * (max - min + 1)).toString()
  }

  async compare(first: string, second: string): Promise<boolean> {
    return first === second
  }
}
