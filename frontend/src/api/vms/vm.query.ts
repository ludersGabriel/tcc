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
    refetchOnWindowFocus: false,
  })

  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    vms: (query.data?.vms ?? []) as VM[],
    error: query.error,
  }
}
