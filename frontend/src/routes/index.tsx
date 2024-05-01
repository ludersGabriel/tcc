import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useLogin } from '../api/auth/login'
import { useAuth } from '../auth'
import { flushSync } from 'react-dom'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: Home,
})

const createLoginSchema = z.object({
  username: z.string().min(3, 'Username is too short'),
  password: z.string().min(3, 'Password is too short'),
})

type LoginForm = z.infer<typeof createLoginSchema>

function Home() {
  const auth = useAuth()
  const navigate = useNavigate()
  const login = useLogin()

  const form = useForm<LoginForm>({
    resolver: zodResolver(createLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (formData: LoginForm) => {
    login.mutate(formData, {
      onSuccess: (data) => {
        flushSync(() => {
          auth.setToken(data.token)
        })

        localStorage.setItem('token', data.token)

        const t = data.success ? toast.success : toast.error

        t(data.message)

        navigate({ to: '/dashboard' })
      },
    })
  }

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 p-5 w-96 rounded-lg shadow-lg'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='winstonSmith'
                    {...field}
                    className='text-black'
                    autoFocus={true}
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
                    placeholder='1234change'
                    type='password'
                    {...field}
                    className='text-black'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='mr-2'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
