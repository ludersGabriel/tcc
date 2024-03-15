export { getVmsForUser } from '../repositories/vms'
import { VM } from '../db/schema'
import { getVmsById } from '../repositories/vms'

export async function getVmsByIdService(
  vmId: number,
  ownerId: number
): Promise<VM> {
  const vm = await getVmsById(vmId, ownerId)

  if (!vm) {
    throw new Error('VM not found')
  }

  return vm
}
