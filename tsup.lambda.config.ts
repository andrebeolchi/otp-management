import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/lambda/otp'],
  outDir: 'dist/lambda',
  target: 'node20',
  format: ['cjs'],
  sourcemap: false,
  clean: true,
  minify: true,
  bundle: true,
  treeshake: true,
  external: ['nodemailer', 'twilio', '@aws-sdk'],
})
