import { useAuth } from '@/auth'
import { UpsertUserForm } from '@/components/admin/users-modal'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { baseUrl } from '../config'

export function useUserUpsert() {
  const auth = useAuth()
  const client = useQueryClient()

  return useMutation({
    mutationKey: ['userUpsert', auth.token],
    mutationFn: async (data: UpsertUserForm) => {
      const resp = await fetch(`${baseUrl}/user/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(data),
      })

      client.invalidateQueries({
        queryKey: ['users', auth.token],
      })

      return resp.json()
    },
  })
}
