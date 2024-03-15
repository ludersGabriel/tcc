import { createFileRoute } from '@tanstack/react-router'
import useGuac from '../../components/guac/Guac'
import { z } from 'zod'

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

  useGuac({ vmId })

  return (
    <div
      id='displayContainer'
      className='w-full h-full overflow-hidden flex justify-center items-center bg-black'
    ></div>
  )
}
