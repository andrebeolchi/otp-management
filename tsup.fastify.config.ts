import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/api-rest'],
  outDir: 'dist/fastify',
  target: 'node20',
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  minify: false,
  bundle: false,
})
