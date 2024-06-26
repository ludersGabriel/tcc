import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
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

export function useDeleteVm() {
  const auth = useAuth()
  const client = useQueryClient()

  return useMutation({
    mutationKey: ['deleteVm'],
    mutationFn: async (vboxId: string) => {
      const resp = await fetch(`${baseUrl}/vms/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ vboxId }),
      })

      client.invalidateQueries({
        queryKey: ['vms', auth.token],
      })

      return resp.json()
    },
  })
}

export function useUploadFiles(vboxId: number) {
  const auth = useAuth()

  return useMutation({
    mutationKey: ['uploadFiles'],
    mutationFn: async (data: FormData) => {
      data.append('vmId', vboxId.toString())
      const resp = await fetch(`${baseUrl}/vms/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: data,
      })

      return resp.json()
    },
  })
}

export function useControlVm() {
  const auth = useAuth()
  const client = useQueryClient()

  return useMutation({
    mutationKey: ['controlVm'],
    mutationFn: async (data: {
      vmId: number
      action: 'start' | 'stop'
    }) => {
      const resp = await fetch(`${baseUrl}/vms/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(data),
      })

      client.invalidateQueries({
        queryKey: ['vms', auth.token],
      })

      return resp.json()
    },
  })
}

export function useDownloadVm() {
  const auth = useAuth()
  useQueryClient()

  return useMutation({
    mutationKey: ['downloadVm', auth.token],
    mutationFn: async (data: { vmId: number }) => {
      const url = new URL(`${baseUrl}/vms/download`)
      url.searchParams.append('vmId', data.vmId.toString())

      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })

      if (!resp.ok) {
        throw new Error('Network response was not ok')
      }

      const blob = await resp.blob()

      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute(
        'download',
        `${data.vmId}-files.zip`
      )

      document.body.appendChild(link)
      link.click()

      link.parentNode!.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      return resp
    },
  })
}
