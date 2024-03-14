import {
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useState } from 'react'
import { LoginMutation, useLogin } from '../api/auth/login'
import { useAuth } from '../auth'
import { flushSync } from 'react-dom'

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

function Home() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<LoginMutation>({
    username: '',
    password: '',
  })

  const login = useLogin()

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    if (name in formData) {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    login.mutate(formData, {
      onSuccess: (data) => {
        flushSync(() => {
          auth.setToken(data.token)
        })

        localStorage.setItem('token', data.token)

        navigate({ to: '/dashboard' })
      },
    })
  }

  return (
    <div className='w-full h-full flex justify-center items-center bg-black text-white'>
      <form
        className='flex flex-col gap-2'
        onSubmit={onSubmit}
      >
        <h1 className='text-3xl font-bold'>
          Big brother is watching you
        </h1>
        <input
          type='text'
          placeholder='Username'
          className='p-2 border-2 border-gray-300 rounded-md bg-black'
          id='username'
          name='username'
          value={formData.username}
          onChange={onChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='p-2 border-2 border-gray-300 rounded-md bg-black'
          id='password'
          name='password'
          value={formData.password}
          onChange={onChange}
        />
        <button className='p-2 bg-blue-500 text-white rounded-md'>
          Login
        </button>
      </form>
    </div>
  )
}
