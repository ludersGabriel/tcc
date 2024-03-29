import { useMutation } from '@tanstack/react-query'
import { baseUrl } from '../config'

export type LoginMutation = {
  username: string
  password: string
}

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async ({
      username,
      password,
    }: LoginMutation) => {
      const resp = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      return resp.json()
    },
  })
}
