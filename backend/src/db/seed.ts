import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import postgres from 'postgres'
import drizzleConfig from '../../drizzle.config'
import { myHash } from '../middleware/auth'
import os from 'os'
import net, { AddressInfo } from 'net'

function getIPv4() {
  const interfaces = os.networkInterfaces()

  for (let iface of Object.values(interfaces)) {
    if (!iface) continue
    for (let alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal)
        return alias.address
    }
  }

  return ''
}

const seedClient = postgres(
  drizzleConfig.dbCredentials.connectionString
)

async function main() {
  const db = drizzle(seedClient, { schema })

  await db.insert(schema.users).values({
    username: 'admin',
    password: await myHash('admin'),
    role: 'admin',
  })

  await db.insert(schema.configs).values({
    id: 1,
  })

  // await db.insert(schema.vms).values({
  //   id: 1,
  //   hostname: getIPv4(),
  //   port: 3341,
  //   name: 'gregio',
  //   description: 'mapa od gregio',
  //   ownerId: 1,
  // })
}

main()
  .then(() => console.log('seed done'))
  .catch((e) => console.log(JSON.stringify(e)))
  .finally(() => seedClient.end())
