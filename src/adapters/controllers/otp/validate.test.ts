import { mock } from 'jest-mock-extended'

import { ValidateOTPUseCase } from '~/domain/otp-management/application/use-cases/validate-otp-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { ValidateOTPController, Body } from './validate'

jest.mock('~/adapters/controllers/interfaces/error-handler', () => ({
  errorHandler: jest.fn(),
}))

//@ts-expect-error for mocking
const request: Request<Body> = {
  body: {
    otp: '123456',
    recipientType: 'email',
    recipientValue: 'test@example.com',
  },
}

describe('ValidateOTPController', () => {
  const validateOTPUseCase = mock<ValidateOTPUseCase>()
  const schemaValidator = mock<SchemaValidator<Body>>()
  const controller = new ValidateOTPController(validateOTPUseCase, schemaValidator)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if schema validation fails', async () => {
    schemaValidator.execute.mockReturnValueOnce({
      data: request.body,
      errors: [{ message: 'Invalid body', path: 'body' }],
    })

    const response = await controller.execute(request)

    expect(schemaValidator.execute).toHaveBeenCalledWith(request.body)
    expect(response.status).toBe(400)
    expect(response.body).toEqual([{ message: 'Invalid body', path: 'body' }])
  })

  it('should return 410 if OTP is expired', async () => {
    schemaValidator.execute.mockReturnValueOnce({
      data: request.body,
      errors: [],
    })
    validateOTPUseCase.execute.mockResolvedValueOnce({ isValid: false, status: 'expired' })

    const response = await controller.execute(request)

    expect(validateOTPUseCase.execute).toHaveBeenCalledWith(request.body)
    expect(response.status).toEqual(410)
    expect(response.body).toEqual({ isValid: false, message: 'OTP has expired' })
  })

  it('should return 400 if OTP is invalid', async () => {
    schemaValidator.execute.mockReturnValueOnce({
      data: request.body,
      errors: [],
    })
    validateOTPUseCase.execute.mockResolvedValueOnce({ status: 'invalid', isValid: false })

    const response = await controller.execute(request)

    expect(validateOTPUseCase.execute).toHaveBeenCalledWith(request.body)
    expect(response.status).toEqual(400)
    expect(response.body).toEqual({ isValid: false, message: 'Invalid OTP' })
  })

  it('should return 200 if OTP is valid', async () => {
    schemaValidator.execute.mockReturnValueOnce({
      data: request.body,
      errors: [],
    })
    validateOTPUseCase.execute.mockResolvedValueOnce({ status: 'valid', isValid: true })

    const response = await controller.execute(request)

    expect(validateOTPUseCase.execute).toHaveBeenCalledWith(request.body)
    expect(response.status).toEqual(200)
    expect(response.body).toEqual({ isValid: true })
  })

  it('should handle unexpected errors', async () => {
    schemaValidator.execute.mockReturnValue({
      data: request.body,
      errors: [],
    })

    const error = new Error('Unexpected error')
    validateOTPUseCase.execute.mockRejectedValueOnce(error)

    //@ts-expect-error mocking
    errorHandler.mockReturnValueOnce({
      status: 500,
      body: { message: 'Internal server error' },
    })

    const response = await controller.execute(request)

    expect(errorHandler).toHaveBeenCalledWith(error)
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ message: 'Internal server error' })
  })
})
