import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
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
import { LoginForm } from '../AuthScreen/LoginForm'
import styles from './UserLoginPanel.module.scss'

export const UserLoginPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectAuthUser)
  const [profileOpen, setProfileOpen] = useState(false)

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
    setProfileOpen(false)
    dispatch(logout())
  }, [dispatch])

  const displayName = user?.name ?? user?.email ?? 'Signed in'

  return (
    <div
      className={clsx(styles.panel, !isAuthenticated && styles.panelNoFooter)}
    >
      <ListPanelStackedHeader
        leadIconKey="userLogin"
        headerTopCenter={
          <div className={styles.headerUserNameWrap}>
            <span className={styles.headerUserName}>
              {isAuthenticated ? displayName : 'Sign in'}
            </span>
          </div>
        }
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
            user?.name && user?.email ? (
              <div className={styles.menu}>
                <button
                  type="button"
                  className={styles.menuItem}
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((value) => !value)}
                >
                  <span className={styles.menuItemLabel}>Profile</span>
                  <span
                    className={clsx(
                      styles.menuItemChevron,
                      profileOpen && styles.menuItemChevronOpen,
                    )}
                    aria-hidden
                  />
                </button>
                {profileOpen ? (
                  <div className={styles.profileDetails}>
                    <p className={styles.profileDetailLineMuted}>{user.email}</p>
                  </div>
                ) : null}
              </div>
            ) : null
          ) : (
            <>
              <p className={styles.guestHint}>
                You can edit postcards and view local history without an
                account. Sign in to sync across devices and back up your work.
              </p>
              <LoginForm />
            </>
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
          >
            Log out
          </button>
        </footer>
      ) : null}
    </div>
  )
}
