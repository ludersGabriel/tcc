import { useAuth } from '@/auth'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'

type Config = {
  id: number
  key: string
  totalMem: number
  concurrentCreation: number
}

export function useConfigs() {
  useQueryClient()
  const auth = useAuth()

  const query = useQuery({
    queryKey: ['configs', auth.token],
    queryFn: () => {
      return fetch(`${baseUrl}/configs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      }).then((res) => res.json())
    },
  })

  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    configs: (query.data?.configs ?? undefined) as Config,
    error: query.error,
  }
}
