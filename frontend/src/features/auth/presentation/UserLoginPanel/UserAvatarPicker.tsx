import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  IconUserRegistered,
  getOrCreateUserRegisteredElementColors,
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
        ? getOrCreateUserRegisteredElementColors(user.id)
        : null,
    [user?.id],
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
        </div>
        {userEmail ? (
          <p className={styles.profileEmail}>{userEmail}</p>
        ) : null}
      </div>
    </div>
  )
}
