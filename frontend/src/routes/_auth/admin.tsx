import Configs from '@/components/admin/configs'
import Users from '@/components/admin/users'
import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/admin')({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== 'admin') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },

  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className='p-5 flex space-x-4'>
      <div className='flex-1 rounded-lg max-w-1/2'>
        <Configs />
      </div>
      <div className='flex-1 rounded-lg max-w-1/2 H'>
        <Users />
      </div>
    </div>
  )
}
