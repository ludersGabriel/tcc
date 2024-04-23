import { and, eq, getTableColumns } from 'drizzle-orm'
import db from '../db/db'
import { User, users } from '../db/schema'

export async function getUserByUsername(
  username: string
): Promise<User | undefined> {
  const ret = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  return ret
}

export type UserDto = Omit<User, 'password'>

export async function getUserById(
  id: number
): Promise<UserDto | undefined> {
  const { password, ...other } = getTableColumns(users)

  const ret = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      password: false,
    },
  })

  return ret
}
