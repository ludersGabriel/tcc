import express from 'express'
import {
  ConnectionSettings,
  encryptToken,
} from '../encryptToken'

const router = express.Router()

router.get('/getToken', (req, res) => {
  const settings: ConnectionSettings = {
    hostname: '192.168.50.197',
    port: 3341,
    'disable-auth': true,
    'enable-wallpaper': true,
    'ignore-cert': true,
    security: 'any',
    'server-layout': 'en-us-qwerty',
    width: 1280,
    height: 720,
  }

  const token = encryptToken(settings)

  console.log({ token })

  res.send({ token })
})

export default router
