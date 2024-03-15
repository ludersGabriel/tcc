import { and, eq } from 'drizzle-orm'
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
