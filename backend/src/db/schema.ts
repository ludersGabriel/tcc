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

export type User = typeof users.$inferSelect
export type UserInput = typeof users.$inferInsert

export const userRelations = relations(
  users,
  ({ many }) => ({
    vms: many(vms),
    requests: many(requests),
  })
)

export const vms = pgTable('vms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull(),
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

export const statusEnum = pgEnum('status', [
  'pending',
  'done',
  'failed',
])

export const requestType = pgEnum('request_type', [
  'create_vm',
  'delete_vm',
])

export const requests = pgTable('requests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  status: statusEnum('status').notNull().default('pending'),
  requestType: requestType('request_type')
    .notNull()
    .default('create_vm'),
  message: text('message'),
})

export type RequestTracker = typeof requests.$inferSelect
export type RequestTrackerInput =
  typeof requests.$inferInsert

export type StatusEnum = typeof statusEnum

export type RequestTypeEnum = typeof requestType

export const requestRelations = relations(
  requests,
  ({ one }) => ({
    user: one(users, {
      fields: [requests.userId],
      references: [users.id],
    }),
  })
)

export const configs = pgTable('configs', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique().default('main'),
  // from 0 to 100%
  totalMem: integer('total_mem').notNull().default(50),
  concurrentCreation: integer('concurrent_creation')
    .notNull()
    .default(2),
})

export type Config = typeof configs.$inferSelect

export type ConfigInput = typeof configs.$inferInsert
