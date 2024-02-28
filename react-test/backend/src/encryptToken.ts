import crypto from 'crypto'

export const CIPHER = 'AES-256-CBC'
export const KEY = 'MySuperSecretKeyForParamsToken12'

/* 

const tokenObject = {
    connection: {
        type: "rdp",
        settings: {
            "hostname": "10.0.0.12",
            "username": "Administrator",
            "password": "pAsSwOrD",
            "enable-drive": true,
            "create-drive-path": true,
            "security": "any",
            "ignore-cert": true,
            "enable-wallpaper": false
        }
    }
};

*/

export interface ConnectionSettings {
  hostname: string
  port: number
  security: string
  'ignore-cert': boolean
  'enable-wallpaper': boolean
  'disable-auth': boolean
  'server-layout': string
}

export interface TokenObject {
  connection: {
    type: string
    settings: ConnectionSettings
  }
}

export function encryptToken(
  settings: ConnectionSettings
): string {
  const tokenObject: TokenObject = {
    connection: {
      type: 'rdp',
      settings,
    },
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    CIPHER,
    Buffer.from(KEY),
    iv
  )

  let encrypted = cipher.update(
    JSON.stringify(tokenObject),
    'utf-8',
    'base64'
  )
  encrypted += cipher.final('base64')

  const data = {
    iv: iv.toString('base64'),
    value: encrypted,
  }

  const jsonStr = JSON.stringify(data)
  const encoded = new Buffer(jsonStr).toString('base64')

  return encoded
}
