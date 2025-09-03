import pino from 'pino'

import { Logger } from '~/infra/logger'

const logger = pino({
  level: process.env.LOG_LEVEL || 'warn',
})

export class PinoLogger implements Logger {
  info(message: string, meta?: Record<string, unknown>): void {
    meta ? logger.info(meta, message) : logger.info(message)
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    meta ? logger.warn(meta, message) : logger.warn(message)
  }

  error(message: string, meta?: Record<string, unknown>): void {
    meta ? logger.error(meta, message) : logger.error(message)
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    meta ? logger.debug(meta, message) : logger.debug(message)
  }
}
