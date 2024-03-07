import {
  index,
  pgSchema,
  serial,
  text,
} from 'drizzle-orm/pg-core'

export const guacSchema = pgSchema('guac_schema')

export const users = guacSchema.table(
  'users',
  {
    id: serial('id').primaryKey(),
    username: text('username'),
  },
  (users) => ({
    usernameIdx: index('username_idx').on(users.username),
  })
)
