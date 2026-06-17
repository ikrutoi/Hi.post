import React, { useMemo } from 'react'
import clsx from 'clsx'
import {
  IconUserRegistered,
  resolveUserRegisteredElementColors,
  type IconUserRegisteredElementColors,
} from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

type UserLoginToolbarIconProps = {
  userId: string
  passportColors?: IconUserRegisteredElementColors | null
  className?: string
}

export const UserLoginToolbarIcon: React.FC<UserLoginToolbarIconProps> = ({
  userId,
  passportColors,
  className,
}) => {
  const elementColors = useMemo(
    () => resolveUserRegisteredElementColors(userId, passportColors),
    [passportColors, userId],
  )

  return (
    <span className={clsx(styles.toolbarUserChromeGlyph, className)} aria-hidden>
      <IconUserRegistered elementColors={elementColors} />
    </span>
  )
}
