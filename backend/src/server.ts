import GuacamoleLite from 'guacamole-lite'
import http from 'http'
import { CIPHER, KEY } from './encryptToken'
import app from './app'

const server = http.createServer(app)

const guacdOptions = {
  port: 4822,
}

const clientOptions = {
  crypt: {
    cypher: CIPHER,
    key: KEY,
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

app.get('/', (req, res) => {
  res.send({
    hello: 'world',
  })
})

server.listen(3000)

function shutdown() {
  console.log('Shutting down gracefully...')

  // Close the HTTP server
  server.close(() => {
    console.log('HTTP server closed.')

    process.exit(0)
  })
}

// Handle ^C and termination signals
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
