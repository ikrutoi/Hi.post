import React, { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { IconKey } from '@shared/config/constants'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
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
import {
  UserAvatarPicker,
  type UserAvatarChangePhotoToolbarActions,
} from './UserAvatarPicker'
import {
  GuestAuthSection,
  type GuestAuthMode,
} from './GuestAuthSection'
import styles from './UserLoginPanel.module.scss'

export const UserLoginPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectAuthUser)
  const [profileOpen, setProfileOpen] = useState(false)
  const [avatarCropActive, setAvatarCropActive] = useState(false)
  const [changePhotoCropActive, setChangePhotoCropActive] = useState(false)
  const [changePhotoCropToolbar, setChangePhotoCropToolbar] =
    useState<UserAvatarChangePhotoToolbarActions | null>(null)
  const [guestAuthMode, setGuestAuthMode] = useState<GuestAuthMode>('signIn')

  const handleChangePhotoCropActive = useCallback((active: boolean) => {
    setChangePhotoCropActive(active)
  }, [])

  const handleChangePhotoCropToolbarActions = useCallback(
    (actions: UserAvatarChangePhotoToolbarActions | null) => {
      setChangePhotoCropToolbar(actions)
    },
    [],
  )

  const userPanelToolbarStateOverride = useMemo(
    () => ({
      applyLight: {
        state: changePhotoCropToolbar?.saving ? 'disabled' : 'enabled',
        options: {},
      },
      editLight: {
        state: changePhotoCropToolbar?.saving ? 'disabled' : 'enabled',
        options: {},
      },
    }),
    [changePhotoCropToolbar?.saving],
  )

  const handleUserPanelToolbarAction = useCallback(
    (key: IconKey) => {
      if (key === 'applyLight') {
        changePhotoCropToolbar?.confirmCrop()
        return false
      }
      if (key === 'editLight') {
        changePhotoCropToolbar?.openFilePicker()
        return false
      }
    },
    [changePhotoCropToolbar],
  )

  const handleAvatarCropModeChange = useCallback((active: boolean) => {
    setAvatarCropActive(active)
    if (active) {
      setProfileOpen(false)
    }
  }, [])

  const handleGuestAuthModeChange = useCallback(
    (mode: GuestAuthMode) => {
      setGuestAuthMode(mode)
      dispatch(clearAuthError())
    },
    [dispatch],
  )

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
        !changePhotoCropActive && styles.panelCompactNoToolbar,
      )}
    >
      <ListPanelStackedHeader
        leadIconKey="userLogin"
        headerTopCenter={
          <div className={styles.headerUserNameWrap}>
            <span className={styles.headerUserName}>
              {isAuthenticated ? displayName : guestHeaderTitle}
            </span>
          </div>
        }
        toolbar={
          changePhotoCropActive ? (
            <Toolbar
              section="userPanel"
              stateOverride={userPanelToolbarStateOverride}
              onActionClick={handleUserPanelToolbarAction}
            />
          ) : (
            false
          )
        }
        showDividerWithoutToolbar={!changePhotoCropActive}
        onClose={handleClose}
        closeAriaLabel="Close account panel"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={clsx(
            styles.content,
            changePhotoCropActive && styles.contentCropMode,
          )}
          aria-label={isAuthenticated ? 'Signed-in user' : 'Sign in'}
        >
          {isAuthenticated ? (
            <>
              <UserAvatarPicker
                onCropModeChange={handleAvatarCropModeChange}
                onChangePhotoCropActive={handleChangePhotoCropActive}
                onChangePhotoCropToolbarActions={
                  handleChangePhotoCropToolbarActions
                }
              />
              {!avatarCropActive && user?.name && user?.email ? (
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
                      <p className={styles.profileDetailLineMuted}>
                        {user.email}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
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
          >
            Log out
          </button>
        </footer>
      ) : null}
    </div>
  )
}
