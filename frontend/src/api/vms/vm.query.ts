import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '../../auth'
import { baseUrl } from '../config'

type VM = {
  id: number
  name: string
  description: string | null
  ownerId: number
  hostname: string
  port: number
  width: number
  height: number
  security: string
  'ignore-cert': boolean
  'enable-wallpaper': boolean
  'disable-auth': boolean
  'server-layout': string
  status: string
  vboxID: string
  localIp: string
}

export function useVms() {
  useQueryClient()
  const auth = useAuth()

  const query = useQuery({
    queryKey: ['vms', auth.token],
    queryFn: () => {
      return fetch(`${baseUrl}/vms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      }).then((res) => res.json())
    },
    refetchInterval: 5 * 1000,
  })

  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    vms: (query.data?.vms ?? []) as VM[],
    error: query.error,
  }
}

export type Requests = {
  id: number
  userId: number
  status: string
  requestType: string
  message: string
}

export function useRequests() {
  useQueryClient()
  const auth = useAuth()

  const query = useQuery({
    queryKey: ['requests', auth.token],
    queryFn: () => {
      return fetch(`${baseUrl}/vms/requests`, {
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
    requests: (query.data?.requests ?? []) as Requests[],
    error: query.error,
  }
}
