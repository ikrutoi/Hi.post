import React, { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import {
  resolveGuestUserRegisteredElementColors,
  resolveUserRegisteredElementColors,
} from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import { UserLoginToolbarIcon } from '@toolbar/presentation/UserLoginToolbarIcon'
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
import { UserPanelChromePattern } from './UserPanelChromePattern'
import {
  GuestAuthSection,
  type GuestAuthMode,
} from './GuestAuthSection'
import {
  UserPanelHub,
  type UserPanelHubSection,
} from './UserPanelHub'
import { CloudBackupStatus } from '@features/sync/presentation/CloudBackupStatus'
import styles from './UserLoginPanel.module.scss'

type UserPanelView = 'hub' | UserPanelHubSection

export const UserLoginPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectAuthUser)
  const [guestAuthMode, setGuestAuthMode] = useState<GuestAuthMode>('signIn')
  const [panelView, setPanelView] = useState<UserPanelView>('hub')

  const handleClose = useCallback(() => {
    if (panelView !== 'hub') {
      setPanelView('hub')
      dispatch(clearAuthError())
      return
    }
    dispatch(setUserLoginPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'userLogin',
        value: 'enabled',
      }),
    )
  }, [dispatch, panelView])

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

  const handleOpenHubSection = useCallback((section: UserPanelHubSection) => {
    setPanelView(section)
  }, [])

  const displayName = user?.name ?? user?.email ?? 'Signed in'
  const cellTitle =
    panelView === 'registration'
      ? 'Registration'
      : panelView === 'info'
        ? 'Info'
        : panelView === 'settings'
          ? 'Settings'
          : null
  const headerTitle =
    panelView === 'hub'
      ? isAuthenticated
        ? displayName
        : null
      : cellTitle
  const showLogoutFooter = isAuthenticated && panelView === 'registration'
  const isHub = panelView === 'hub'
  const hideLeadIcon = !isAuthenticated || !isHub
  const chromePatternColors = useMemo(
    () =>
      isAuthenticated && user?.id != null
        ? resolveUserRegisteredElementColors(user.id, user.passportColors)
        : resolveGuestUserRegisteredElementColors(),
    [isAuthenticated, user?.id, user?.passportColors],
  )
  const hasChromePattern = true
  const leadIconOverride = useMemo(
    () =>
      isAuthenticated && user?.id != null ? (
        <UserLoginToolbarIcon
          userId={user.id}
          passportColors={user.passportColors}
          passportEmblemForm={user.passportEmblemForm}
        />
      ) : null,
    [isAuthenticated, user?.id, user?.passportColors, user?.passportEmblemForm],
  )

  return (
    <div
      className={clsx(
        styles.panel,
        !showLogoutFooter && styles.panelNoFooter,
        styles.panelCompactNoToolbar,
        hasChromePattern && styles.panelWithChromePattern,
        isAuthenticated && styles.panelSignedIn,
        !isAuthenticated && styles.panelGuest,
        !isHub && styles.panelCellOpen,
      )}
    >
      <ListPanelStackedHeader
        leadIconKey="userLogin"
        leadIconOverride={leadIconOverride}
        variant="sectionToolbar"
        cardPieListHeaderIcons
        chromeBackground={
          hasChromePattern ? (
            <UserPanelChromePattern elementColors={chromePatternColors} />
          ) : undefined
        }
        headerTopCenter={
          headerTitle ? (
            <div
              className={clsx(
                styles.headerUserNameWrap,
                !isHub && styles.headerUserNameWrapCell,
              )}
            >
              <span className={styles.headerUserName}>{headerTitle}</span>
            </div>
          ) : null
        }
        toolbar={false}
        hideLeadIcon={hideLeadIcon}
        onClose={handleClose}
        closeAriaLabel={isHub ? 'Close account panel' : 'Back'}
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={clsx(
            styles.content,
            panelView === 'hub' && styles.contentHub,
          )}
          aria-label={headerTitle ?? 'Account'}
        >
          {panelView === 'hub' ? (
            <UserPanelHub onOpenSection={handleOpenHubSection} />
          ) : panelView === 'registration' ? (
            isAuthenticated ? (
              <>
                <UserAvatarPicker userEmail={user?.email} />
                <CloudBackupStatus />
              </>
            ) : (
              <GuestAuthSection
                mode={guestAuthMode}
                onModeChange={handleGuestAuthModeChange}
              />
            )
          ) : panelView === 'info' ? (
            <p className={styles.guestHint}>Hint images will appear here.</p>
          ) : (
            <p className={styles.guestHint}>Settings will appear here.</p>
          )}
        </div>
      </ScrollArea>
      {showLogoutFooter ? (
        <div className={styles.panelFooterStack}>
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
        </div>
      ) : null}
    </div>
  )
}
