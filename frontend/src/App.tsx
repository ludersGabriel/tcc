import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'
import { AuthProvider } from './auth'

import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  return <RouterProvider router={router} />
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
