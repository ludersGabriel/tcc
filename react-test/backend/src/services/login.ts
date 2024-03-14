import { User } from '../db/schema'
import { verifyHash } from '../middleware/auth'
import { getUserByUsername } from '../models/users'

export async function login(
  username: string,
  password: string
): Promise<User> {
  const user = await getUserByUsername(username)

  if (!user) {
    throw new Error('Invalid username or password')
  }

  const isValid = await verifyHash(password, user.password)

  if (!isValid) {
    throw new Error('Invalid username or password')
  }

  return user
}
