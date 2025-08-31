import { faker } from '@faker-js/faker'

import { HashProvider } from '~/domain/otp-management/application/repositories/hash-provider'
import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'

import { GenerateOTPUseCase } from './generate-otp-use-case'

function makeMocks() {
  const otpRepository: Partial<jest.Mocked<OTPRepository>> = {
    save: jest.fn(),
    findByEmail: jest.fn(),
    deleteByEmail: jest.fn(),
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

  it('should delete existing OTP before generating a new one', async () => {
    const { otpRepository, otpProvider, hashProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, otpProvider, hashProvider)

    const existingOTP = {
      createdAt: new Date(),
      email: faker.internet.email(),
      expiresAt: new Date(Date.now() + 30000),
      hashedOTP: 'old-hashed-otp',
      otp: '654321',
    }

    otpProvider.generate!.mockResolvedValue('123456')
    hashProvider.hash!.mockResolvedValue('hashed-123456')
    otpRepository.findByEmail!.mockResolvedValue(existingOTP)

    const request = { email: existingOTP.email }

    const result = await useCase.execute(request)

    expect(otpRepository.deleteByEmail).toHaveBeenCalledWith(existingOTP.email)
    expect(otpRepository.save).toHaveBeenCalledTimes(1)
    expect(result.hashedOTP).toBe('hashed-123456')
  })
})
