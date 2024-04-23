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

export function useUser() {
  useQueryClient()

  const token = localStorage.getItem('token') ?? ''

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
  })

  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    user: query.data as User | null,
    error: query.error,
  }
}
