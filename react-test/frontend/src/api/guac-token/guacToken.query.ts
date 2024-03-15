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

      console.log({ url })

      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error(err)
        })
    },
    refetchOnWindowFocus: false,
  })

  console.log('fetching token')
  console.log(query.data?.token)

  return {
    isPending: query.isPending,
    isFetching: query.isFetching,
    token: query.data?.token,
    error: query.error,
  }
}
