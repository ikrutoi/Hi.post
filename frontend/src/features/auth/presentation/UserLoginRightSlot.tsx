import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectUserLoginPanelOpen } from '@features/auth/infrastructure/selectors/authSelectors'
import { UserLoginPanel } from './UserLoginPanel'

export const UserLoginRightSlot: React.FC = () => {
  const userLoginPanelOpen = useAppSelector(selectUserLoginPanelOpen)

  if (!userLoginPanelOpen) return null

  return <UserLoginPanel />
}
