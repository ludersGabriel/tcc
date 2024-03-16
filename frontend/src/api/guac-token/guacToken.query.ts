import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'
import { useAuth } from '../../auth'

type Props = {
  vmId: number
}

export function useGuacToken({ vmId }: Props) {
  useQueryClient()
  const auth = useAuth()

  const query = useQuery({
    queryKey: ['guacToken', auth.token, vmId],
    queryFn: () => {
      const url = new URL(`${baseUrl}/getToken`)
      url.searchParams.append('vmId', vmId.toString())

      return fetch(url, {
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
    token: query.data?.token,
    error: query.error,
  }
}
