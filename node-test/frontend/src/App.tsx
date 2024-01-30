import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { trpc } from './trpc'
import { httpBatchLink } from '@trpc/client';
import Hello from './components/hello/Hello';
import GuacRDP from './components/guac-rdp/GuacRDP';

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
        }),
        
      ],
    }),
  );
  

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hello />
        <GuacRDP />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
