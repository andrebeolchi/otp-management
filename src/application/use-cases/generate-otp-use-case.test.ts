import { faker } from '@faker-js/faker'

import { HashProvider } from '~/application/repositories/hash-provider'
import { OTPProvider } from '~/application/repositories/otp-provider'
import { OTPRepository } from '~/application/repositories/otp-repository'

import { GenerateOTPUseCase } from './generate-otp-use-case'

function makeMocks() {
  const otpRepository: Partial<jest.Mocked<OTPRepository>> = {
    save: jest.fn(),
  }

  const otpProvider: Partial<jest.Mocked<OTPProvider>> = {
    generate: jest.fn(),
  }

  const hashProvider: Partial<jest.Mocked<HashProvider>> = {
    hash: jest.fn(),
  }

  return { otpRepository, otpProvider, hashProvider }
}

function makeUseCase(
  otpRepository: Partial<jest.Mocked<OTPRepository>>,
  otpProvider: Partial<jest.Mocked<OTPProvider>>,
  hashProvider: Partial<jest.Mocked<HashProvider>>
) {
  return new GenerateOTPUseCase(
    otpRepository as OTPRepository,
    otpProvider as OTPProvider,
    hashProvider as HashProvider
  )
}

describe('[use-case] generate otp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate an OTP and save it to the repository', async () => {
    const { otpRepository, otpProvider, hashProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, otpProvider, hashProvider)

    otpProvider.generate!.mockResolvedValue('123456')
    hashProvider.hash!.mockResolvedValue('hashed-123456')

    const request = {
      email: faker.internet.email(),
    }

    const result = await useCase.execute(request)

    expect(result.otp).toBe('123456')
    expect(result.hashedOTP).toBe('hashed-123456')
    expect(result.isExpired()).toBe(false)
  })
})
