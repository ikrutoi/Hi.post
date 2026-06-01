import React, { useCallback, useMemo, useRef, useState } from 'react'
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
  UserAvatarPicker,
  type AvatarCropState,
  type UserAvatarCropToolbarActions,
  type UserAvatarPickerHandle,
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
  })
  const avatarPickerRef = useRef<UserAvatarPickerHandle>(null)
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
    if (!isAuthenticated || !avatarCropState.active) {
      return null
    }
    return 'userPanelChoicePhoto'
  }, [avatarCropState.active, isAuthenticated])

  const cropToolbarSaving = cropToolbarActions?.saving ?? false
  const cropToolbarCanApply = cropToolbarActions?.canApply ?? false

  const userPanelToolbarStateOverride = useMemo(
    () => ({
      applyLight: {
        state:
          cropToolbarSaving || !cropToolbarCanApply ? 'disabled' : 'enabled',
        options: {},
      },
      return: {
        state: cropToolbarSaving ? 'disabled' : 'enabled',
        options: {},
      },
      userLoginAdd: {
        state: cropToolbarSaving ? 'disabled' : 'enabled',
        options: {},
      },
    }),
    [cropToolbarCanApply, cropToolbarSaving],
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
      if (key === 'userLoginAdd') {
        avatarPickerRef.current?.openFilePicker()
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
                ref={avatarPickerRef}
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
