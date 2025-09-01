import { mock } from 'jest-mock-extended'

import { GenerateOTPUseCase } from '~/domain/otp-management/application/use-cases/generate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { GenerateOTPController, Body } from './generate'

jest.mock('~/adapters/controllers/interfaces/error-handler', () => ({
  errorHandler: jest.fn(),
}))

describe('[controller] generate otp', () => {
  const generateOTPUseCase = mock<GenerateOTPUseCase>()
  const schemaValidator = mock<SchemaValidator<Body>>()
  const controller = new GenerateOTPController(generateOTPUseCase, schemaValidator)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 201 when OTP is generated successfully', async () => {
    const request = {
      body: {
        recipientType: 'email' as const,
        recipientValue: 'test@example.com',
      },
    }

    schemaValidator.execute.mockReturnValue({
      data: request.body,
      errors: [],
    })

    //@ts-expect-error mocking
    const response = await controller.execute(request)

    expect(schemaValidator.execute).toHaveBeenCalledWith(request.body)
    expect(generateOTPUseCase.execute).toHaveBeenCalledWith(request.body)
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'OTP generated successfully' })
  })

  it('should return 400 when validation fails', async () => {
    const request = {
      body: {
        recipientType: 'email',
        recipientValue: '',
      },
    }

    schemaValidator.execute.mockReturnValue({
      data: {
        recipientType: 'email',
        recipientValue: '',
      },
      errors: [{ message: 'Invalid recipient value', path: 'recipientValue' }],
    })

    //@ts-expect-error mocking
    const response = await controller.execute(request)

    expect(schemaValidator.execute).toHaveBeenCalledWith(request.body)
    expect(generateOTPUseCase.execute).not.toHaveBeenCalled()
    expect(response.status).toBe(400)
    expect(response.body).toEqual([{ message: 'Invalid recipient value', path: 'recipientValue' }])
  })

  it('should handle errors and return appropriate response', async () => {
    const request = {
      body: {
        recipientType: 'email' as const,
        recipientValue: 'test@example.com',
      },
    }

    schemaValidator.execute.mockReturnValue({
      data: request.body,
      errors: [],
    })

    const error = new Error('Unexpected error')
    generateOTPUseCase.execute.mockRejectedValue(error)

    //@ts-expect-error mocking
    errorHandler.mockReturnValue({
      status: 500,
      body: [{ message: 'Internal server error' }],
    })

    //@ts-expect-error mocking
    const response = await controller.execute(request)

    expect(schemaValidator.execute).toHaveBeenCalledWith(request.body)
    expect(generateOTPUseCase.execute).toHaveBeenCalledWith(request.body)
    expect(response.status).toBe(500)
    expect(response.body).toEqual([{ message: 'Internal server error' }])
  })
})
