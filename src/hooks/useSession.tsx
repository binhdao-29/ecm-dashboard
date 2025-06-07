import React from 'react'
import { SessionContext } from '../contexts/SessionContext'

export function useSession() {
  return React.useContext(SessionContext)
}
