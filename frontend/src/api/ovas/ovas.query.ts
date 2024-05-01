import { useAuth } from '@/auth'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'

export function useOvas() {
  useQueryClient()
  const auth = useAuth()

  const query = useQuery({
    queryKey: ['ovas', auth.token],
    queryFn: () => {
      return fetch(`${baseUrl}/ovas`, {
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
    ovas: (query.data?.ovas ?? []) as string[],
    error: query.error,
  }
}
