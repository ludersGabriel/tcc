import { and, eq, getTableColumns } from 'drizzle-orm'
import db from '../db/db'
import { User, UserInput, users } from '../db/schema'

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

export async function getUsers(): Promise<UserDto[]> {
  const { password, ...other } = getTableColumns(users)

  return await db.query.users.findMany({
    columns: {
      password: false,
    },
  })
}

export async function createUser(
  data: UserInput
): Promise<UserDto> {
  const [ret] = await db
    .insert(users)
    .values(data)
    .returning()

  const { password, ...other } = ret

  return other
}

export async function updateUser(
  userId: number,
  data: Partial<UserInput>
): Promise<UserDto> {
  const [ret] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning()

  const { password, ...other } = ret

  return other
}
