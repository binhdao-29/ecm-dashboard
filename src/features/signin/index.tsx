'use client'
import { useSession } from '@/hooks/useSession'
import type { Session } from '@toolpad/core/AppProvider'
import { SignInPage } from '@toolpad/core/SignInPage'
import { useNavigate } from 'react-router'

const fakeAsyncGetSession = async (formData: FormData): Promise<Session> => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password === 'demo') {
        resolve({
          user: {
            name: 'Binh Dao',
            email,
            image: 'https://avatars.githubusercontent.com/u/19550456'
          }
        })
      }
      reject(new Error('Incorrect credentials.'))
    }, 1000)
  })
}

export default function SignIn() {
  const { setSession } = useSession()
  const navigate = useNavigate()
  return (
    <SignInPage
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      signIn={async (provider, formData, callbackUrl) => {
        // Demo session
        try {
          const session = await fakeAsyncGetSession(formData)
          if (session) {
            setSession(session)
            navigate(callbackUrl || '/', { replace: true })
            return {}
          }
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An error occurred' }
        }
        return {}
      }}
    />
  )
}
