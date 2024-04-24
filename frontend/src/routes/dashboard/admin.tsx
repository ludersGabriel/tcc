import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin')({
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== 'admin') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },

  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  )
}
