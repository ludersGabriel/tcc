import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import config from '../../drizzle.config'

const queryClient = postgres(
  config.dbCredentials.connectionString
)
const db = drizzle(queryClient)

export default db
