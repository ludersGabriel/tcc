import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'

export function useGuacToken() {
  useQueryClient()

  const query = useQuery({
    queryKey: ['guacToken'],
    queryFn: () => {
      return fetch(`${baseUrl}/getToken`).then((res) =>
        res.json()
      )
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
