import { HashProvider } from '~/domain/otp-management/application/repositories/hash-provider'
import { OTPProvider } from '~/domain/otp-management/application/repositories/otp-provider'
import { OTPRepository } from '~/domain/otp-management/application/repositories/otp-repository'
import { GenerateOTPUseCase } from '~/domain/otp-management/application/use-cases/generate-otp-use-case'

import { Request } from '~/adapters/controllers/interfaces/request'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { Body, GenerateOTPController } from './generate'

function makeMocks() {
  const otpRepository: Partial<jest.Mocked<OTPRepository>> = { save: jest.fn() }
  const otpProvider: Partial<jest.Mocked<OTPProvider>> = { generate: jest.fn() }
  const hashProvider: Partial<jest.Mocked<HashProvider>> = { hash: jest.fn() }
  const schemaValidator: Partial<jest.Mocked<SchemaValidator<Body>>> = { execute: jest.fn() }

  return { otpRepository, otpProvider, hashProvider, schemaValidator }
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

describe('[controller] generate otp controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 201 and OTP when input is valid', async () => {
    const { otpRepository, otpProvider, hashProvider, schemaValidator } = makeMocks()
    const useCase = makeUseCase(otpRepository, otpProvider, hashProvider)

    schemaValidator.execute!.mockReturnValue({ data: { email: 'test@example.com' }, errors: [] })
    useCase.execute = jest.fn().mockResolvedValue({ otp: '123456' })

    const controller = new GenerateOTPController(useCase, schemaValidator as SchemaValidator<Body>)
    const request = { body: { email: 'test@example.com' } } as Request<Body>

    const response = await controller.execute(request)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ otp: '123456' })
    expect(useCase.execute).toHaveBeenCalledWith({ email: 'test@example.com' })
  })

  it('should return 400 when validation fails', async () => {
    const { otpRepository, otpProvider, hashProvider, schemaValidator } = makeMocks()
    const useCase = makeUseCase(otpRepository, otpProvider, hashProvider)
    const errors = [{ path: 'email', message: 'Invalid email' }]

    //@ts-expect-error mocking
    schemaValidator.execute!.mockReturnValue({ data: null, errors })
    useCase.execute = jest.fn()

    const controller = new GenerateOTPController(useCase, schemaValidator as SchemaValidator<Body>)
    const request = { body: { email: 'invalid-email' } } as Request<Body>

    const response = await controller.execute(request)

    expect(response.status).toBe(400)
    expect(response.body).toEqual(errors)
    expect(useCase.execute).not.toHaveBeenCalled()
  })

  it('should handle use case errors with errorHandler', async () => {
    const { otpRepository, otpProvider, hashProvider, schemaValidator } = makeMocks()
    const useCase = makeUseCase(otpRepository, otpProvider, hashProvider)
    const error = new Error('Something went wrong')

    schemaValidator.execute!.mockReturnValue({ data: { email: 'test@example.com' }, errors: [] })
    useCase.execute = jest.fn().mockRejectedValue(error)

    const controller = new GenerateOTPController(useCase, schemaValidator as SchemaValidator<Body>)
    const request = { body: { email: 'test@example.com' } } as Request<Body>

    const response = await controller.execute(request)

    expect(response.status).toBeDefined()
    expect(response.body).toBeDefined()
  })
})
