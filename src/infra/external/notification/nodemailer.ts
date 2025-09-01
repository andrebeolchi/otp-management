import * as nodemailer from 'nodemailer'

import { config } from '~/infra/config'

const nodemailerClient = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'login',
    user: config.google.email,
    pass: config.google.password,
  },
})

export { nodemailerClient }
