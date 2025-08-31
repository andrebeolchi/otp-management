import { HashProvider } from '~/domain/otp-management/application/repositories/hash-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'
import { ValidateOTPUseCase } from '~/domain/otp-management/application/use-cases/validate-otp-use-case'

function makeMocks() {
  const otpRepository: Partial<jest.Mocked<OTPRepository>> = {
    save: jest.fn(),
    findByEmail: jest.fn(),
    deleteByEmail: jest.fn(),
  }

  const hashProvider: Partial<jest.Mocked<HashProvider>> = {
    hash: jest.fn(),
    compare: jest.fn(),
  }

  return { otpRepository, hashProvider }
}

function makeUseCase(
  otpRepository: Partial<jest.Mocked<OTPRepository>>,
  hashProvider: Partial<jest.Mocked<HashProvider>>
) {
  return new ValidateOTPUseCase(otpRepository as OTPRepository, hashProvider as HashProvider)
}

describe('ValidateOTPUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return false if no OTP exists for the given email', async () => {
    const { otpRepository, hashProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, hashProvider)

    otpRepository.findByEmail!.mockResolvedValue(null)

    const result = await useCase.execute({ email: 'test@example.com', otp: '123456' })

    expect(result).toBe(false)
  })

  it('should return false if the OTP is invalid', async () => {
    const { otpRepository, hashProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, hashProvider)

    //@ts-expect-error mocking
    otpRepository.findByEmail!.mockResolvedValue({
      hashedOTP: 'hashed_otp',
      expiresAt: new Date(Date.now() + 10000),
    })
    hashProvider.compare!.mockResolvedValue(false)

    const result = await useCase.execute({ email: 'test@example.com', otp: '123456' })

    expect(result).toBe(false)
  })

  it('should return false if the OTP is expired', async () => {
    const { otpRepository, hashProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, hashProvider)

    //@ts-expect-error mocking
    otpRepository.findByEmail!.mockResolvedValue({
      hashedOTP: 'hashed_otp',
      expiresAt: new Date(Date.now() - 10000),
    })
    hashProvider.compare!.mockResolvedValue(true)

    const result = await useCase.execute({ email: 'test@example.com', otp: '123456' })

    expect(result).toBe(false)
  })

  it('should return true and delete the OTP if it is valid and not expired', async () => {
    const { otpRepository, hashProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, hashProvider)

    //@ts-expect-error mocking
    otpRepository.findByEmail!.mockResolvedValue({
      hashedOTP: 'hashed_otp',
      expiresAt: new Date(Date.now() + 10000),
    })
    hashProvider.compare!.mockResolvedValue(true)

    const result = await useCase.execute({ email: 'test@example.com', otp: '123456' })

    expect(result).toBe(true)
    expect(otpRepository.deleteByEmail).toHaveBeenCalledWith('test@example.com')
  })
})
