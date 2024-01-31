import GuacamoleLite from 'guacamole-lite'
import express from 'express'
import http from 'http'
import cors from 'cors'
import {
  CIPHER,
  ConnectionSettings,
  KEY,
  encryptToken,
} from './encryptToken'

const app = express()

app.use(cors())

const server = http.createServer(app)

const guacdOptions = {
  port: 4822,
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

const serverOptions = {
  server,
}

new GuacamoleLite(
  serverOptions,
  guacdOptions,
  clientOptions
)

app.get('/getToken', (req, res) => {
  const settings: ConnectionSettings = {
    hostname: '10.1.1.202',
    port: 3341,
    'create-drive-path': true,
    'disable-auth': true,
    'enable-drive': true,
    'enable-wallpaper': true,
    'ignore-cert': true,
    security: 'any',
  }

  const token = encryptToken(settings)

  console.log({ token })

  res.send({ token })
})

app.get('/', (req, res) => {
  res.send({
    hello: 'world',
  })
})

server.listen(3000)
