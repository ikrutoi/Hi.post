import React, { useMemo } from 'react'
import clsx from 'clsx'
import {
  IconUserRegisteredEmblem,
  resolveUserRegisteredElementColors,
  type IconUserRegisteredElementColors,
  type UserRegisteredEmblemForm,
} from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

type UserLoginToolbarIconProps = {
  userId: string
  passportColors?: IconUserRegisteredElementColors | null
  passportEmblemForm?: UserRegisteredEmblemForm | null
  className?: string
}

export const UserLoginToolbarIcon: React.FC<UserLoginToolbarIconProps> = ({
  userId,
  passportColors,
  passportEmblemForm,
  className,
}) => {
  const elementColors = useMemo(
    () => resolveUserRegisteredElementColors(userId, passportColors),
    [passportColors, userId],
  )

  return (
    <span className={clsx(styles.toolbarUserChromeGlyph, className)} aria-hidden>
      <IconUserRegisteredEmblem
        form={passportEmblemForm}
        elementColors={elementColors}
      />
    </span>
  )
}
