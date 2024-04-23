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

import { Toaster } from 'react-hot-toast'

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
    <RouterProvider router={router} context={{ auth }} />
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
