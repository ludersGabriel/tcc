import { useAuth } from '@/auth'
import { ConfigForm } from '@/components/admin/update-config'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'

export function useUpdateConfigs() {
  const auth = useAuth()
  const client = useQueryClient()

  return useMutation({
    mutationKey: ['updateConfigs', auth.token],
    mutationFn: async (data: ConfigForm) => {
      const resp = await fetch(
        `${baseUrl}/configs/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(data),
        }
      )

      client.invalidateQueries({
        queryKey: ['configs', auth.token],
      })

      return resp.json()
    },
  })
}
