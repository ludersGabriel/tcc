import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import config from '../../drizzle.config'
import * as schema from './schema'

const queryClient = postgres(config.dbCredentials.url)
const db = drizzle(queryClient, { schema })

export default db
