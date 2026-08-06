import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  IconSparkles,
  IconUserRegisteredEmblem,
  nextUserRegisteredEmblemForm,
  resolveUserRegisteredElementColors,
} from '@shared/ui/icons'
import { updateUserPassportEmblemForm } from '@features/auth/infrastructure/state/auth.slice'
import { selectAuthUser } from '@features/auth/infrastructure/selectors/authSelectors'
import styles from './UserAvatarPicker.module.scss'

type UserAvatarPickerProps = {
  userEmail?: string | null
}

export const UserAvatarPicker: React.FC<UserAvatarPickerProps> = ({
  userEmail,
}) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const registeredAvatarColors = useMemo(
    () =>
      user?.id != null
        ? resolveUserRegisteredElementColors(user.id, user.passportColors)
        : null,
    [user?.id, user?.passportColors],
  )

  const handleCycleEmblemForm = useCallback(() => {
    dispatch(
      updateUserPassportEmblemForm(
        nextUserRegisteredEmblemForm(user?.passportEmblemForm),
      ),
    )
  }, [dispatch, user?.passportEmblemForm])

  return (
    <div className={styles.root}>
      <div className={styles.profileRow}>
        <div className={styles.profileAvatarWrap}>
          <div className={styles.profileAvatar} aria-hidden>
            {registeredAvatarColors ? (
              <span className={styles.profileAvatarPlaceholder}>
                <IconUserRegisteredEmblem
                  form={user?.passportEmblemForm}
                  elementColors={registeredAvatarColors}
                />
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.sparklesButton}
            onClick={handleCycleEmblemForm}
            onPointerUp={(event) => {
              event.currentTarget.blur()
            }}
            aria-label="Change emblem style"
            title="Change emblem style"
          >
            <IconSparkles />
          </button>
        </div>
        {userEmail ? (
          <p className={styles.profileEmail}>{userEmail}</p>
        ) : null}
      </div>
    </div>
  )
}
