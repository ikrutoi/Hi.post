import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { getToolbarIcon } from '@shared/utils/icons'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  clearAuthError,
  logout,
  setUserLoginPanelOpen,
} from '@features/auth/infrastructure/state/auth.slice'
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '@features/auth/infrastructure/selectors/authSelectors'
import { UserAvatarPicker } from './UserAvatarPicker'
import {
  GuestAuthSection,
  type GuestAuthMode,
} from './GuestAuthSection'
import { CloudBackupStatus } from '@features/sync/presentation/CloudBackupStatus'
import styles from './UserLoginPanel.module.scss'

export const UserLoginPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectAuthUser)
  const [guestAuthMode, setGuestAuthMode] = useState<GuestAuthMode>('signIn')

  const handleClose = useCallback(() => {
    dispatch(setUserLoginPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'userLogin',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleGuestAuthModeChange = useCallback(
    (mode: GuestAuthMode) => {
      setGuestAuthMode(mode)
      dispatch(clearAuthError())
    },
    [dispatch],
  )

  const handleLogout = useCallback(() => {
    setGuestAuthMode('signIn')
    dispatch(logout())
  }, [dispatch])

  const displayName = user?.name ?? user?.email ?? 'Signed in'
  const guestHeaderTitle =
    guestAuthMode === 'register' ? 'Create account' : 'Sign in'

  return (
    <div
      className={clsx(
        styles.panel,
        !isAuthenticated && styles.panelNoFooter,
        styles.panelCompactNoToolbar,
      )}
    >
      <ListPanelStackedHeader
        leadIconKey="userLogin"
        variant="sectionToolbar"
        cardPieListHeaderIcons
        headerTopCenter={
          <div className={styles.headerUserNameWrap}>
            <span className={styles.headerUserName}>
              {isAuthenticated ? displayName : guestHeaderTitle}
            </span>
          </div>
        }
        toolbar={false}
        showDividerWithoutToolbar
        onClose={handleClose}
        closeAriaLabel="Close account panel"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.content}
          aria-label={isAuthenticated ? 'Signed-in user' : 'Sign in'}
        >
          {isAuthenticated ? (
            <>
              <UserAvatarPicker userEmail={user?.email} />
              <CloudBackupStatus />
            </>
          ) : (
            <GuestAuthSection
              mode={guestAuthMode}
              onModeChange={handleGuestAuthModeChange}
            />
          )}
        </div>
      </ScrollArea>
      {isAuthenticated ? (
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={(event) => {
              event.stopPropagation()
              handleLogout()
            }}
            aria-label="Log out"
            title="Log out"
          >
            {getToolbarIcon({ key: 'userLoginOut' })}
          </button>
        </footer>
      ) : null}
    </div>
  )
}
