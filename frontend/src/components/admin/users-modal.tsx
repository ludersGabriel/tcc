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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useUserUpsert } from '@/api/user/user.mutation'
import toast from 'react-hot-toast'

const upsertUserSchema = z.object({
  username: z.string().min(3, 'Username is too short'),
  role: z.enum(['admin', 'user']),
  id: z.coerce.number().optional(),
  password: z
    .string()
    .min(8, 'Password is too short. Min 8 chars'),
})

export type UpsertUserForm = z.infer<
  typeof upsertUserSchema
>

export default function UpsertUser() {
  const [open, setOpen] = useState<boolean>(false)
  const upsertUser = useUserUpsert()

  const form = useForm<UpsertUserForm>({
    resolver: zodResolver(upsertUserSchema),
    defaultValues: {
      // id: undefined,
      password: '',
      username: '',
      role: 'user',
    },
  })

  function onSubmit(data: UpsertUserForm) {
    upsertUser.mutate(data, {
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
          <Button onClick={handleOpen}>Add User</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new user
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='password'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='admin'>
                        Admin
                      </SelectItem>
                      <SelectItem value='user'>
                        User
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mr-2'>
              Create
            </Button>
            <DialogClose asChild onClick={resetForm}>
              <Button type='button' variant='secondary'>
                Cancel
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
