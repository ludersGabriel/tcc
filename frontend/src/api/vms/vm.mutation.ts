import { useMutation } from '@tanstack/react-query'
import { CreateVmForm } from '../../components/create-vm/createVM'
import { baseUrl } from '../config'
import { useAuth } from '@/auth'

export function useCreateVm() {
  const auth = useAuth()

  return useMutation({
    mutationKey: ['createVm'],
    mutationFn: async (data: CreateVmForm) => {
      const resp = await fetch(`${baseUrl}/vms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(data),
      })

      return resp.json()
    },
  })
}
