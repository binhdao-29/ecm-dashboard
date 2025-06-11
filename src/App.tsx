import { useState, useCallback, useMemo } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CollectionsIcon from '@mui/icons-material/Collections'
import PeopleIcon from '@mui/icons-material/People'
import CommentIcon from '@mui/icons-material/Comment'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import { Outlet, useNavigate } from 'react-router'
import type { Navigation, Session } from '@toolpad/core/AppProvider'
import { SessionContext } from '@/contexts/SessionContext'

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Menu items'
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />
  },
  {
    segment: 'sales',
    title: 'Sales',
    icon: <AttachMoneyIcon />
  },
  {
    segment: 'catalog',
    title: 'Catalog',
    icon: <CollectionsIcon />
  },
  {
    segment: 'customers',
    title: 'Customers',
    icon: <PeopleIcon />
  },
  {
    segment: 'reviews',
    title: 'Reviews',
    icon: <CommentIcon />
  }
]

const BRANDING = {
  title: 'Admin Dashboard'
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  const signIn = useCallback(() => {
    navigate('/sign-in')
  }, [navigate])

  const signOut = useCallback(() => {
    setSession(null)
    navigate('/sign-in')
  }, [navigate])

  const sessionContextValue = useMemo(() => ({ session, setSession }), [session, setSession])

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  )
}
