import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import postgres from 'postgres'
import drizzleConfig from '../../drizzle.config'
import { myHash } from '../middleware/auth'

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
}

main()
  .then(() => console.log('seed done'))
  .catch((e) => console.log(JSON.stringify(e)))
  .finally(() => seedClient.end())
