import { config } from '~/infra/config'

import { app } from './app'

app
  .listen({
    port: +config.port,
    host: '0.0.0.0',
  })
  .then(() => console.log(`Server is running on port ${config?.port}`))
  .catch(console.error)
