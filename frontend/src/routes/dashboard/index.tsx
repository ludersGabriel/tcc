import {
  Link,
  createFileRoute,
  redirect,
} from '@tanstack/react-router'
import { useVms } from '../../api/vms/vm.query'

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
    <table className='w-full text-center my-2'>
      <caption className='text-2xl'>Telescreens</caption>
      <thead>
        <tr className='m-10'>
          <th>Name</th>
          <th>Description</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {/* dynamic part goes here */}
        {vms.map((vm) => {
          return (
            <tr key={vm.id}>
              <td>{vm.name}</td>
              <td>{vm.description}</td>
              <td>{vm.status}</td>
              <td>
                <Link
                  to={'/dashboard/vm'}
                  search={{
                    vmId: vm.id,
                  }}
                >
                  access
                </Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
