import App from '@/App'
import { createBrowserRouter } from 'react-router'
import Dashboard from '@/features/dashboard'
import Orders from '@/features/orders'
import SignIn from '@/features/signin'
import Layout from '@/layouts'

export const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: Dashboard
          },
          {
            path: '/orders',
            Component: Orders
          }
        ]
      },
      {
        path: '/sign-in',
        Component: SignIn
      }
    ]
  }
])
