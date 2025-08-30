import { faker } from '@faker-js/faker'

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

  return { otpRepository, otpProvider }
}

function makeUseCase(
  otpRepository: Partial<jest.Mocked<OTPRepository>>,
  otpProvider: Partial<jest.Mocked<OTPProvider>>
) {
  return new GenerateOTPUseCase(otpRepository as OTPRepository, otpProvider as OTPProvider)
}

describe('[use-case] generate otp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate an OTP and save it to the repository', async () => {
    const { otpRepository, otpProvider } = makeMocks()
    const useCase = makeUseCase(otpRepository, otpProvider)

    otpProvider.generate!.mockResolvedValue('123456')

    const request = {
      email: faker.internet.email(),
    }

    const result = await useCase.execute(request)

    expect(result.otp).toBe('123456')
  })
})
