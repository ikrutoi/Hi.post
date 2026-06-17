import React, { useMemo } from 'react'
import clsx from 'clsx'
import {
  IconUserRegistered,
  getOrCreateUserRegisteredElementColors,
} from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

type UserLoginToolbarIconProps = {
  userId: string
  className?: string
}

export const UserLoginToolbarIcon: React.FC<UserLoginToolbarIconProps> = ({
  userId,
  className,
}) => {
  const elementColors = useMemo(
    () => getOrCreateUserRegisteredElementColors(userId),
    [userId],
  )

  return (
    <span className={clsx(styles.toolbarUserChromeGlyph, className)} aria-hidden>
      <IconUserRegistered elementColors={elementColors} />
    </span>
  )
}
