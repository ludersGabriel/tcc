import { and, eq } from 'drizzle-orm'
import db from '../db/db'
import { vms } from '../db/schema'

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
