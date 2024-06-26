import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './src/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://postgres:postgres@localhost:5500/db',
  },
} satisfies Config
