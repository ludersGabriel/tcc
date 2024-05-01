import { Config, ConfigInput } from '../db/schema'
import {
  getConfig,
  getConfigByKey,
  updateConfig,
} from '../repositories/configs'
import { getUserByIdService } from './users'

export async function getConfigService(
  key: string,
  userId: number
): Promise<Config> {
  const user = await getUserByIdService(userId)

  if (!user || !(user.role === 'admin')) {
    throw new Error('User not found or not admin')
  }

  const config = await getConfig(key)

  if (!config) {
    throw new Error('Config not found')
  }

  return config
}

export async function updateConfigService(
  id: number,
  userId: number,
  data: ConfigInput
): Promise<Config> {
  const user = await getUserByIdService(userId)

  if (!user || !(user.role === 'admin')) {
    throw new Error('User not found or not admin')
  }

  return await updateConfig(id, data)
}

export async function getConfigByKeyService(
  key: string
): Promise<Config> {
  const config = await getConfigByKey(key)

  if (!config) {
    throw new Error('Config not found')
  }

  return config
}
