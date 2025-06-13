import App from '@/App'
import { createBrowserRouter } from 'react-router'
import Dashboard from '@/features/dashboard'
import Orders from '@/features/orders'
import SignIn from '@/features/signin'
import Layout from '@/layouts'
import { path } from './path'
import Customers from '@/features/customers'
import Review from '@/features/reviews'
import DetailCustomer from '@/features/detailCustomer'
import DetailReview from '@/features/detailReview'
import DetailOrder from '@/features/detailOrder'

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
            path: path.sales,
            Component: Orders
          },
          {
            path: path.catalog,
            Component: Orders
          },
          {
            path: path.customers,
            Component: Customers
          },
          {
            path: path.reviews,
            Component: Review
          },
          {
            path: path.detailCustomer,
            Component: DetailCustomer
          },
          {
            path: path.detailReview,
            Component: DetailReview
          },
          {
            path: path.detailOrder,
            Component: DetailOrder
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
