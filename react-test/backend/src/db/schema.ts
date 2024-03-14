import { InferSelectModel } from 'drizzle-orm'
import {
  index,
  pgEnum,
  pgSchema,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['admin', 'user'])

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').notNull().default('user'),
  },
  (users) => ({
    usernameIdx: index('username_idx').on(users.username),
  })
)

export type User = InferSelectModel<typeof users>
