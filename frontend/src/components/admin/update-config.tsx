import { useForm } from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Button } from '../ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { useUpdateConfigs } from '@/api/configs/configs.mutation'
import toast from 'react-hot-toast'

const ConfigSchema = z.object({
  totalMem: z.coerce
    .number()
    .min(1, 'Total Memory is too low'),
  concurrentCreation: z.coerce
    .number()
    .min(1, 'Concurrent Creation is too low'),
  key: z.string(),
  id: z.coerce.number(),
})

export type ConfigForm = z.infer<typeof ConfigSchema>

type Props = {
  config: ConfigForm
  open: boolean
  setOpen: (open: boolean) => void
}

export default function UpdateConfig({
  config,
  open,
  setOpen,
}: Props) {
  const form = useForm<ConfigForm>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      id: config.id,
      key: config.key,
      totalMem: config.totalMem,
      concurrentCreation: config.concurrentCreation,
    },
  })

  const updateConfig = useUpdateConfigs()

  function onSubmit(data: ConfigForm) {
    updateConfig.mutate(data, {
      onSuccess: (data) => {
        const t = data.success ? toast.success : toast.error

        t(data.message)
      },
    })

    handleOpen()
  }

  function resetForm() {
    form.reset()
    form.clearErrors()
  }

  function handleOpen() {
    setOpen(!open)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update VM</DialogTitle>
          <DialogDescription>
            Update the VM configuration
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <FormField
              control={form.control}
              name='totalMem'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Memory (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Total Memory'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='concurrentCreation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concurrent Creation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Concurrent Creation'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
              <Button type='submit'>Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
