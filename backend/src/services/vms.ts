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

export async function createVmService(
  name: string,
  description: string,
  ownerId: number
): Promise<VM> {
  const ovaPath = '~/ovas/gregio.ova'
  const rdpPort = await findFreePort()
  const { stdout } = await execAsync(
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

  return await createVm(
    name,
    description,
    ownerId,
    getIPv4(),
    rdpPort,
    vmName,
    vmId
  )
}

export async function deleteVmService(
  vmId: string,
  ownerId: number
): Promise<VM> {
  await execAsync(`bash src/scripts/delete.sh ${vmId}`)

  return await deleteVm(vmId, ownerId)
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

  const command = `bash src/scripts/upload.sh ${vboxID} jurgens ${pathsArg}`
  console.log({ command })

  const { stderr, stdout } = await execAsync(command)

  if (stderr) {
    throw new Error('Error uploading files')
  }
}
