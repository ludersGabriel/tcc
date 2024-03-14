import postgres from 'postgres'
import config from '../../drizzle.config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'

const migrationClient = postgres(
  config.dbCredentials.connectionString,
  { max: 1 }
)
migrate(drizzle(migrationClient), {
  migrationsFolder: config.out,
  migrationsSchema: config.schema,
})
  .then(() => {
    console.log('Migrations complete')
    migrationClient.end()
  })
  .catch((err) => {
    console.error('Error running migrations', err)
    migrationClient.end()
  })
