import { useRequests } from '@/api/vms/vm.query'
import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/_auth/requests')({
  component: RequestsDash,
})

function RequestsDash() {
  const { requests } = useRequests()

  return (
    <div className='p-5'>
      <Table>
        <TableCaption>
          A list of your registered requests.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mensagem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.requestType}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{request.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
