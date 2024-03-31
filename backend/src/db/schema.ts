import { InferSelectModel, relations } from 'drizzle-orm'
import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  boolean,
  integer,
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

export const userRelations = relations(
  users,
  ({ many }) => ({
    vms: many(vms),
  })
)

export const vms = pgTable('vms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id),
  hostname: text('hostname').notNull(),
  port: integer('port').notNull(),
  width: integer('width').notNull().default(1280),
  height: integer('height').notNull().default(720),
  security: text('security').notNull().default('any'),
  'ignore-cert': boolean('ignore_cert')
    .notNull()
    .default(true),
  'enable-wallpaper': boolean('enable_wallpaper')
    .notNull()
    .default(true),
  'disable-auth': boolean('disable_auth')
    .notNull()
    .default(true),
  'server-layout': text('server_layout')
    .notNull()
    .default('en-us-qwerty'),
  vboxName: text('vbox_name').notNull().unique(),
  vboxID: text('vbox_id').notNull().unique(),
})

export type VM = InferSelectModel<typeof vms>

export const vmRelations = relations(vms, ({ one }) => ({
  owner: one(users, {
    fields: [vms.ownerId],
    references: [users.id],
  }),
}))
