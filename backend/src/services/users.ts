import { User } from '../db/schema'
import {
  UserDto,
  getUserById,
  getUserByUsername,
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
