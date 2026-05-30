import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  logout,
  setUserLoginPanelOpen,
} from '@features/auth/infrastructure/state/auth.slice'
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '@features/auth/infrastructure/selectors/authSelectors'
import styles from './UserLoginPanel.module.scss'

export const UserLoginPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectAuthUser)

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

  const handleLogout = useCallback(() => {
    dispatch(logout())
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'userLogin',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const displayName = user?.name ?? user?.email ?? 'Signed in'

  return (
    <div className={styles.panel}>
      <ListPanelStackedHeader
        leadIconKey="userLogin"
        headerTopCenter={
          isAuthenticated ? (
            <div className={styles.headerUserNameWrap}>
              <span className={styles.headerUserName}>{displayName}</span>
            </div>
          ) : null
        }
        showDividerWithoutToolbar
        onClose={handleClose}
        closeAriaLabel="Close profile"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div className={styles.content} aria-label="Signed-in user">
          {isAuthenticated ? (
            <>
              {user?.email && user.name ? (
                <p className={styles.userEmail}>{user.email}</p>
              ) : null}
            </>
          ) : null}
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
          >
            Log out
          </button>
        </footer>
      ) : null}
    </div>
  )
}
