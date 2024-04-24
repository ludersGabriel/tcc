import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'

export type User = {
  id: number
  username: string
  role: string
}

export function useUser(token: string) {
  useQueryClient()

  const query = useQuery({
    queryKey: ['user', token],
    queryFn: () => {
      return fetch(`${baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json())
    },
    enabled: !!token,
  })

  if (!token) {
    return {
      isPending: false,
      isFetching: false,
      user: null,
      error: null,
    }
  }

  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    user: query.data?.user as User | null,
    error: query.error,
  }
}
