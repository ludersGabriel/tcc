import { createFileRoute } from '@tanstack/react-router'
import useGuac from '../../components/guac/Guac'
import useFileTransfer from '@/components/file-transfer/fileTransfer'
import { z } from 'zod'
import { useDownloadVm } from '@/api/vms/vm.mutation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { baseUrl } from '@/api/config'

const vmSearchSchema = z.object({
  vmId: z.number().catch(1),
})

export type VMSearch = z.infer<typeof vmSearchSchema>

export const Route = createFileRoute('/_auth/vm')({
  component: VM,
  validateSearch: (search) => vmSearchSchema.parse(search),
  beforeLoad: async ({ context, search }) => {
    const client = context.queryClient
    const token = localStorage.getItem('token')
    const vmId = search.vmId

    try {
      const data = await client.fetchQuery({
        queryKey: ['guacToken', token, vmId],
        queryFn: () => {
          const url = new URL(`${baseUrl}/getToken`)
          url.searchParams.append('vmId', vmId.toString())

          return fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json())
        },
      })

      return { guacToken: data.token as string }
    } catch {
      return { guacToken: '' }
    }
  },
})

function VM() {
  const { vmId } = Route.useSearch()
  const { guacToken } = Route.useRouteContext()

  const downloadOutput = useDownloadVm()

  useGuac({ token: guacToken })
  useFileTransfer({ containerId: 'displayContainer', vmId })

  function handleDownloadOutput() {
    downloadOutput.mutate(
      { vmId },
      {
        onSuccess: () => {
          toast.success('Downloaded output')
        },
      }
    )
  }

  return (
    <>
      <Button onClick={handleDownloadOutput}>
        Download output
      </Button>
      <div
        id='displayContainer'
        className='w-full h-full overflow-hidden flex justify-center items-center bg-black'
      ></div>
    </>
  )
}
