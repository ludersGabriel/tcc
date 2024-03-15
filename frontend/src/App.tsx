import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'
import { AuthProvider, useAuth } from './auth'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()

  if (auth.isLoading) return null

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

export default App
