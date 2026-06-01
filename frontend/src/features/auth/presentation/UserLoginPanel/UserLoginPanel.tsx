import React, { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarSection } from '@toolbar/domain/types'
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
  USER_PANEL_CHANGE_PHOTO_TOOLBAR,
  USER_PANEL_CHOICE_PHOTO_TOOLBAR,
} from '@toolbar/domain/types/userPanel.types'
import {
  UserAvatarPicker,
  type AvatarCropState,
  type UserAvatarCropToolbarActions,
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
  const [avatarCropState, setAvatarCropState] = useState<AvatarCropState>({
    active: false,
    mode: null,
  })
  const [cropToolbarActions, setCropToolbarActions] =
    useState<UserAvatarCropToolbarActions | null>(null)
  const [guestAuthMode, setGuestAuthMode] = useState<GuestAuthMode>('signIn')

  const handleAvatarCropStateChange = useCallback((state: AvatarCropState) => {
    setAvatarCropState(state)
    if (state.active) {
      setProfileOpen(false)
    }
  }, [])

  const handleCropToolbarActions = useCallback(
    (actions: UserAvatarCropToolbarActions | null) => {
      setCropToolbarActions(actions)
    },
    [],
  )

  const userPanelToolbarSection = useMemo<ToolbarSection | null>(() => {
    if (!isAuthenticated || !avatarCropState.active || avatarCropState.mode == null) {
      return null
    }
    return avatarCropState.mode === 'change'
      ? 'userPanelChangePhoto'
      : 'userPanelChoicePhoto'
  }, [avatarCropState, isAuthenticated])

  const userPanelToolbarGroups = useMemo(() => {
    if (userPanelToolbarSection === 'userPanelChangePhoto') {
      return USER_PANEL_CHANGE_PHOTO_TOOLBAR
    }
    if (userPanelToolbarSection === 'userPanelChoicePhoto') {
      return USER_PANEL_CHOICE_PHOTO_TOOLBAR
    }
    return undefined
  }, [userPanelToolbarSection])

  const cropToolbarSaving = cropToolbarActions?.saving ?? false

  const userPanelToolbarStateOverride = useMemo(
    () => ({
      applyLight: {
        state: cropToolbarSaving ? 'disabled' : 'enabled',
        options: {},
      },
      return: {
        state: cropToolbarSaving ? 'disabled' : 'enabled',
        options: {},
      },
      editLight: {
        state: cropToolbarSaving ? 'disabled' : 'enabled',
        options: {},
      },
    }),
    [cropToolbarSaving],
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

  const handleUserPanelToolbarAction = useCallback(
    (key: IconKey) => {
      if (key === 'applyLight') {
        cropToolbarActions?.confirmCrop()
        return false
      }
      if (key === 'return') {
        cropToolbarActions?.cancelCrop()
        return false
      }
      if (key === 'editLight') {
        cropToolbarActions?.openFilePicker()
        return false
      }
    },
    [cropToolbarActions],
  )

  const handleGuestAuthModeChange = useCallback(
    (mode: GuestAuthMode) => {
      setGuestAuthMode(mode)
      dispatch(clearAuthError())
    },
    [dispatch],
  )

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
        !userPanelToolbarSection && styles.panelCompactNoToolbar,
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
          userPanelToolbarSection ? (
            <Toolbar
              section={userPanelToolbarSection}
              groupsOverride={userPanelToolbarGroups}
              stateOverride={userPanelToolbarStateOverride}
              onActionClick={handleUserPanelToolbarAction}
            />
          ) : (
            false
          )
        }
        showDividerWithoutToolbar={!userPanelToolbarSection}
        onClose={handleClose}
        closeAriaLabel="Close account panel"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={clsx(
            styles.content,
            avatarCropState.active && styles.contentCropMode,
          )}
          aria-label={isAuthenticated ? 'Signed-in user' : 'Sign in'}
        >
          {isAuthenticated ? (
            <>
              <UserAvatarPicker
                onAvatarCropStateChange={handleAvatarCropStateChange}
                onCropToolbarActions={handleCropToolbarActions}
              />
              {!avatarCropState.active && user?.name && user?.email ? (
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
