import {
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route =
  createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
  })

function RootComponent() {
  return (
    <main className='w-full h-full bg-black text-white p-0 m-0'>
      <Outlet />
      <TanStackRouterDevtools
        position='bottom-right'
        initialIsOpen={false}
      />
    </main>
  )
}
