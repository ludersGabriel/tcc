import {
  User,
  userQueryOptions,
} from '@/api/user/user.query'
import { useAuth } from '@/auth'
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: async ({ context }) => {
    const client = context.queryClient

    try {
      const data = await client.fetchQuery(userQueryOptions)

      return { user: data.user as User }
    } catch (e) {
      throw redirect({
        to: '/',
      })
    }
  },
})

function AuthLayout() {
  const { user } = Route.useRouteContext()
  const auth = useAuth()

  return (
    <>
      <nav className='p-3 flex gap-2 text-lg justify-between items-center'>
        <Link to={'/dashboard'}>Dashboard</Link>
        {user.role === 'admin' && (
          <Link to='/admin'>Admin</Link>
        )}
        <Link to={'/requests'}>Requests</Link>
        <button onClick={auth.logout}>Logout</button>
      </nav>
      <hr />
      <Outlet />
    </>
  )
}
