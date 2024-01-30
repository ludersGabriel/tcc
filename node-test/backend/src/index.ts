import { publicProcedure, router } from './trpc'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import * as trpcExpress from '@trpc/server/adapters/express'
import GuacLite from 'guacamole-lite'
import {
  encryptToken,
  type ConnectionSettings,
  CIPHER,
  KEY,
} from './encryptToken'

const appRouter = router({
  hello: publicProcedure.query(
    () => 'hello from the backend'
  ),
  getToken: publicProcedure.query(() => {
    const settings: ConnectionSettings = {
      hostname: '10.1.1.202',
      port: '3392',
      'create-drive-path': true,
      'disable-auth': true,
      'enable-drive': true,
      'enable-wallpaper': true,
      'ignore-cert': true,
      password: 'password',
      username: 'admin',
      security: 'any',
    }

    const token = encryptToken(settings)

    return token
  }),
})

const app = express()
app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
)

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
)

// app.listen(3000)
// console.log(`Listening on http://localhost:3000`)

const httpServer = createServer(app)

const websocketOptions = {
  server: httpServer,
}

const guacdOptions = {
  port: 4822,
  host: 'localhost',
}

const clientOptions = {
  crypt: {
    cypher: CIPHER,
    key: KEY,
  },
  log: {
    level: 'DEBUG',
  },
}

export const guacServer = new GuacLite(
  websocketOptions,
  guacdOptions,
  clientOptions
)

guacServer.on('open', (clientConnection) => {
  console.log(clientConnection)
})

guacServer.on('error', (clientConnection, error) => {
  console.error(clientConnection, error)
})

httpServer.listen(3000, () => {
  console.log(
    'HTTP server running on http://localhost:3000'
  )
})

export type AppRouter = typeof appRouter
