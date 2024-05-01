import fs from 'fs'
import path from 'path'

export async function getOvas(): Promise<string[]> {
  const ovas = fs
    .readdirSync(path.join(__dirname, '../ovas'))
    .filter((ova) => ova.endsWith('.ova'))

  return ovas
}
