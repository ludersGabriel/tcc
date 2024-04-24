import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { useAuth, type AuthContext } from '../auth'

interface MyRouterContext {
  auth: AuthContext
}

export const Route =
  createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
  })

function RootComponent() {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <main className='w-full h-full bg-black text-white p-0 m-0'>
      {auth.isAuthenticated ? (
        <>
          <main className='p-3 flex gap-2 text-lg justify-between items-center'>
            <Link to={'/dashboard'}>Dashboard</Link>
            {auth.user?.role === 'admin' && (
              <Link to='/dashboard/admin'>Admin</Link>
            )}
            <button
              onClick={() => {
                auth.logout()
                navigate({ to: '/' })
              }}
            >
              Logout
            </button>
          </main>
          <hr />
        </>
      ) : null}

      <Outlet />
      <TanStackRouterDevtools
        position='bottom-right'
        initialIsOpen={false}
      />
    </main>
  )
}
