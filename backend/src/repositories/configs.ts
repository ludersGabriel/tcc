import { eq } from 'drizzle-orm'
import db from '../db/db'
import { Config, ConfigInput, configs } from '../db/schema'

export async function getConfig(
  key: string
): Promise<Config | undefined> {
  return await db.query.configs.findFirst({
    where: eq(configs.key, key),
  })
}

export async function updateConfig(
  id: number,
  data: ConfigInput
): Promise<Config> {
  const [ret] = await db
    .update(configs)
    .set(data)
    .where(eq(configs.id, id))
    .returning()

  return ret
}

export async function getConfigByKey(
  key: string
): Promise<Config | undefined> {
  return await db.query.configs.findFirst({
    where: eq(configs.key, key),
  })
}
