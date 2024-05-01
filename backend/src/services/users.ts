import { User, UserInput } from '../db/schema'
import { myHash } from '../middleware/auth'
import {
  UserDto,
  createUser,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
} from '../repositories/users'

export function getUserByUsernameService(
  username: string
): Promise<User | undefined> {
  return getUserByUsername(username)
}

export function getUserByIdService(
  id: number
): Promise<UserDto | undefined> {
  return getUserById(id)
}

export async function getUsersService(
  userId: number
): Promise<UserDto[]> {
  const user = await getUserByIdService(userId)

  if (user?.role !== 'admin') {
    throw new Error('User not found or not admin')
  }

  return await getUsers()
}

export async function upsertUser(
  userId: number,
  data: UserInput
): Promise<UserDto> {
  const agent = await getUserByIdService(userId)

  if (agent?.role !== 'admin') {
    throw new Error('User not found or not admin')
  }

  if (data.password) {
    data.password = await myHash(data.password)
  }

  if (data.id) {
    return await updateUser(data.id, data)
  }

  return await createUser(data)
}
