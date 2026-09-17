import React, { useMemo } from 'react'
import clsx from 'clsx'
import {
  IconUserRegisteredEmblem,
  resolveGuestUserRegisteredElementColors,
  resolveUserRegisteredElementColors,
  type IconUserRegisteredElementColors,
  type UserRegisteredEmblemForm,
} from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

type UserLoginToolbarIconProps = {
  userId?: string
  passportColors?: IconUserRegisteredElementColors | null
  passportEmblemForm?: UserRegisteredEmblemForm | null
  guest?: boolean
  className?: string
}

export const UserLoginToolbarIcon: React.FC<UserLoginToolbarIconProps> = ({
  userId,
  passportColors,
  passportEmblemForm,
  guest = false,
  className,
}) => {
  const elementColors = useMemo(() => {
    if (guest) return resolveGuestUserRegisteredElementColors()
    if (userId == null) return resolveGuestUserRegisteredElementColors()
    return resolveUserRegisteredElementColors(userId, passportColors)
  }, [guest, passportColors, userId])

  return (
    <span className={clsx(styles.toolbarUserChromeGlyph, className)} aria-hidden>
      <IconUserRegisteredEmblem
        elementColors={elementColors}
        form={guest ? undefined : passportEmblemForm}
      />
    </span>
  )
}
