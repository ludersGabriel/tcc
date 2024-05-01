import { and, eq } from 'drizzle-orm'
import db from '../db/db'
import { VM, vms } from '../db/schema'

export async function getVmsForUser(userId: number) {
  return await db.query.vms.findMany({
    where: eq(vms.ownerId, userId),
  })
}

export async function getVmsById(
  vmId: number,
  ownerId: number
) {
  return await db.query.vms.findFirst({
    where: and(eq(vms.id, vmId), eq(vms.ownerId, ownerId)),
  })
}

export async function createVm(
  name: string,
  description: string,
  ownerId: number,
  hostname: string,
  port: number,
  vboxName: string,
  vboxID: string,
  username: string
): Promise<VM> {
  const [ret] = await db
    .insert(vms)
    .values({
      name,
      description,
      ownerId,
      hostname,
      port,
      vboxName,
      vboxID,
      username,
    })
    .returning()

  return ret
}

export async function deleteVm(
  id: string,
  ownerId: number
): Promise<VM> {
  const [ret] = await db
    .delete(vms)
    .where(
      and(eq(vms.vboxID, id), eq(vms.ownerId, ownerId))
    )
    .returning()

  return ret
}
