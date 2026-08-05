import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  IconSparkles,
  IconUserRegistered,
  resolveUserRegisteredElementColors,
} from '@shared/ui/icons'
import { selectAuthUser } from '@features/auth/infrastructure/selectors/authSelectors'
import styles from './UserAvatarPicker.module.scss'

type UserAvatarPickerProps = {
  userEmail?: string | null
}

export const UserAvatarPicker: React.FC<UserAvatarPickerProps> = ({
  userEmail,
}) => {
  const user = useAppSelector(selectAuthUser)
  const registeredAvatarColors = useMemo(
    () =>
      user?.id != null
        ? resolveUserRegisteredElementColors(user.id, user.passportColors)
        : null,
    [user?.id, user?.passportColors],
  )

  return (
    <div className={styles.root}>
      <div className={styles.profileRow}>
        <div className={styles.profileAvatarWrap}>
          <div className={styles.profileAvatar} aria-hidden>
            {registeredAvatarColors ? (
              <span className={styles.profileAvatarPlaceholder}>
                <IconUserRegistered elementColors={registeredAvatarColors} />
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.sparklesButton}
            disabled
            aria-disabled
            aria-label="Emblem style"
            title="Emblem style"
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
