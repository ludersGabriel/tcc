import { createFileRoute } from '@tanstack/react-router'
import useGuac from '../../components/guac/Guac'
import useFileTransfer from '@/components/file-transfer/fileTransfer'
import { z } from 'zod'
import { useDownloadVm } from '@/api/vms/vm.mutation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const vmSearchSchema = z.object({
  vmId: z.number().catch(1),
})

export type VMSearch = z.infer<typeof vmSearchSchema>

export const Route = createFileRoute('/dashboard/vm')({
  component: VM,
  validateSearch: (search) => vmSearchSchema.parse(search),
})

function VM() {
  const { vmId } = Route.useSearch()

  const downloadOutput = useDownloadVm()

  useGuac({ vmId })
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
