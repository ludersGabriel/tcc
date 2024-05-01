export { getVmsForUser } from '../repositories/vms'
import { VM } from '../db/schema'
import {
  createVm,
  deleteVm,
  getVmsById,
} from '../repositories/vms'
import os from 'os'
import net, { AddressInfo } from 'net'
import sysPath from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import {
  createRequestService,
  findPendingRequestsService,
  updateRequestService,
} from './requests'
import { getConfigByKeyService } from './configs'
const execAsync = promisify(exec)

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

function getIPv4() {
  const interfaces = os.networkInterfaces()

  for (let iface of Object.values(interfaces)) {
    if (!iface) continue
    for (let alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal)
        return alias.address
    }
  }

  return ''
}

async function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', (error) => {
      reject(error)
    })

    server.listen(0, () => {
      const { port } = server.address() as AddressInfo
      server.close(() => {
        resolve(port)
      })
    })
  })
}

export async function validateCreation() {
  const pendingCreation =
    await findPendingRequestsService('create_vm')

  const configs = await getConfigByKeyService('main')

  if (!configs) {
    throw new Error('Main config not found')
  }

  if (
    pendingCreation.length >= configs.concurrentCreation
  ) {
    throw new Error(
      'Too many VMs being created. Try again later'
    )
  }

  const { stdout } = await execAsync(
    `bash src/scripts/createdVms.sh`
  )

  const registeredVms = parseInt(
    stdout
      .split('\n')
      .find((line) => line.startsWith('Total:'))
      ?.split(': ')[1] ?? '0'
  )

  if (
    registeredVms === undefined ||
    registeredVms === null ||
    isNaN(registeredVms)
  ) {
    throw new Error('Error getting registered VMs')
  }

  const totalVms = registeredVms + pendingCreation.length

  const totalMemory = os.totalmem() / 1024 ** 3

  if (
    totalVms * 4 >
    totalMemory * (configs.totalMem / 100)
  ) {
    throw new Error(
      `Not enough memory to create VM. Total memory: ${(totalMemory * (configs.totalMem / 100)).toFixed(2)}GB, used or to be used memory: ${(totalVms * 4).toFixed(2)}GB`
    )
  }
}

export async function createVmService(
  name: string,
  description: string,
  ova: string,
  username: string,
  ownerId: number
): Promise<VM | undefined> {
  const req = await createRequestService({
    userId: ownerId,
    status: 'pending',
    requestType: 'create_vm',
  })

  try {
    const ovaPath = 'src/ovas/' + ova

    const rdpPort = await findFreePort()

    const { stdout, stderr } = await execAsync(
      `bash src/scripts/create.sh ${ovaPath} ${rdpPort}`
    )

    const lines = stdout.split('\n')
    const vmNameLine = lines.find((line) =>
      line.startsWith('VM Name:')
    )
    const vmIdLine = lines.find((line) =>
      line.startsWith('VM ID:')
    )

    if (!vmNameLine || !vmIdLine) {
      throw new Error(
        'VM Name or ID not found in script output.'
      )
    }

    const vmName = vmNameLine.split(': ')[1]
    const vmId = vmIdLine.split(': ')[1]

    if (!vmName || !vmId) {
      throw new Error(
        'VM Name or ID not found in script output.' +
          '\n' +
          stderr
      )
    }

    const ret = await createVm(
      name,
      description,
      ownerId,
      getIPv4(),
      rdpPort,
      vmName,
      vmId,
      username
    )

    await updateRequestService(req.id, {
      status: 'done',
    })

    return ret
  } catch (e) {
    console.log(e)
    await updateRequestService(req.id, {
      status: 'failed',
      message: (e as any) ?? 'Unknown error',
    })
  }
}

export async function deleteVmService(
  vmId: string,
  ownerId: number
): Promise<VM> {
  const ret = await deleteVm(vmId, ownerId)

  await execAsync(`bash src/scripts/delete.sh ${vmId}`)

  return ret
}

export async function uploadFilesService(
  vmId: number,
  ownerId: number,
  paths: string[]
): Promise<void> {
  const vm = await getVmsById(vmId, ownerId)

  if (!vm) {
    throw new Error('VM not found')
  }

  const { vboxID } = vm

  let pathsArg = ''

  for (let path of paths) {
    const absolute = sysPath.resolve(`./${path}`)
    pathsArg += `${absolute} `
  }

  const command = `bash src/scripts/upload.sh ${vboxID} ${vm.username} ${pathsArg}`

  const { stderr, stdout } = await execAsync(command)

  for (let path of paths) {
    await execAsync(`rm -f ${path}`)
  }

  if (stderr) {
    console.log(stdout)
    console.log(stderr)
    throw new Error('Error uploading files')
  }
}

export async function downloadFilesService(
  vmId: number,
  ownerId: number
): Promise<string> {
  const vm = await getVmsById(vmId, ownerId)

  if (!vm) {
    throw new Error('VM not found')
  }

  const command = `bash src/scripts/download.sh ${vm.vboxID} ${vm.username}`

  const { stderr, stdout } = await execAsync(command)

  console.log(stdout)
  console.log(stderr)

  return `src/outputs/${vm.vboxID}-output`
}

export async function getVmIp(vmId: string) {
  const { stdout } = await execAsync(
    `bash src/scripts/getIp.sh ${vmId}`
  )

  return stdout
}

export async function getVmStatus(vmId: string) {
  const { stdout } = await execAsync(
    `bash src/scripts/vmStatus.sh ${vmId}`
  )

  return stdout
}

export async function turnVmOn(vmId: string) {
  await execAsync(`bash src/scripts/turnon.sh ${vmId}`)
}

export async function turnVmOff(vmId: string) {
  await execAsync(`bash src/scripts/turnoff.sh ${vmId}`)
}
