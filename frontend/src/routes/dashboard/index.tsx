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

  return (
    <>
      <Table>
        <TableCaption>
          A list of your registered vms.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
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
              <TableCell>{vm.status}</TableCell>
              <TableCell>
                <Link
                  to={'/dashboard/vm'}
                  search={{
                    vmId: vm.id,
                  }}
                >
                  access
                </Link>
              </TableCell>
              <TableCell>
                <DeleteVM vboxId={vm.vboxID} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateVM />
    </>
  )
}
