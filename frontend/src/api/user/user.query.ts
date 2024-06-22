import {
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'
import { useAuth } from '@/auth'

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

export function useUsers() {
  useQueryClient()
  const auth = useAuth()

  const query = useQuery({
    queryKey: ['users', auth.token],
    queryFn: () => {
      return fetch(`${baseUrl}/user/users`, {
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
    users: (query.data?.users ?? []) as User[],
    error: query.error,
  }
}

export const userQueryOptions = queryOptions({
  queryKey: ['user-query'],
  queryFn: me,
  staleTime: Infinity,
})

async function me() {
  const token = localStorage.getItem('token')

  if (!token) throw new Error('No token found')

  const res = await fetch(`${baseUrl}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch user')

  return await res.json()
}
