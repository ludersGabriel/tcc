import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useCreateVm } from '@/api/vms/vm.mutation'
import toast from 'react-hot-toast'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOvas } from '@/api/ovas/ovas.query'

const createVmSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  description: z
    .string()
    .min(3, 'Description is too short'),
  ova: z.string(),
  username: z.string(),
})

export type CreateVmForm = z.infer<typeof createVmSchema>

export default function CreateVM() {
  const [open, setOpen] = useState<boolean>(false)
  const createVm = useCreateVm()
  const { ovas } = useOvas()

  const form = useForm<CreateVmForm>({
    resolver: zodResolver(createVmSchema),
    defaultValues: {
      name: '',
      description: '',
      ova: '',
      username: '',
    },
  })

  function onSubmit(data: CreateVmForm) {
    createVm.mutate(data, {
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
      <DialogTrigger asChild>
        <div className='flex justify-center align-middle p-5'>
          <Button>Create VM</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create VM</DialogTitle>
          <DialogDescription>
            Create a new virtual machine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='description'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='username'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    username used in the ova
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ova'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ova</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an ova' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ovas.map((ova) => (
                        <SelectItem key={ova} value={ova}>
                          {ova}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='mr-2'>
              Submit
            </Button>

            <DialogClose asChild onClick={resetForm}>
              <Button type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
