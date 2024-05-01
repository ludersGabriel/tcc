import {
  Link,
  createFileRoute,
  redirect,
} from '@tanstack/react-router'
import { useVms } from '../../api/vms/vm.query'
import CreateVM from '@/components/create-vm/createVM'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DeleteVM from '@/components/delete-vm/deleteVM'
import ControlVm from '@/components/control-vm/controlVm'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { vms } = useVms()

  function decideAction(status: string) {
    return status === 'running' ? 'stop' : 'start'
  }

  function decideIp(
    hostname: string,
    status: string,
    localIp: string
  ) {
    if (hostname === localIp || status !== 'running') {
      return '-'
    }

    return localIp
  }

  return (
    <div className='p-5'>
      <Table>
        <TableCaption>
          A list of your registered vms.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Local Ip</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vms.map((vm) => (
            <TableRow key={vm.id}>
              <TableCell>{vm.name}</TableCell>
              <TableCell>{vm.description}</TableCell>
              <TableCell>
                {decideIp(
                  vm.hostname,
                  vm.status,
                  vm.localIp
                )}
              </TableCell>
              <TableCell>{vm.status}</TableCell>
              <TableCell>
                {vm.status === 'running' ? (
                  <Link
                    to={'/dashboard/vm'}
                    search={{
                      vmId: vm.id,
                    }}
                  >
                    access
                  </Link>
                ) : (
                  <span>offline</span>
                )}
              </TableCell>
              <TableCell>
                <DeleteVM vboxId={vm.vboxID} />
                <ControlVm
                  vmId={vm.id}
                  action={decideAction(vm.status)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateVM />
    </div>
  )
}
