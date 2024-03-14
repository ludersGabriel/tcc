import {
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

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
  return (
    <div className='p-2'>
      <h3>Welcome to the Dashboard!</h3>
    </div>
  )
}
