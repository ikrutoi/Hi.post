import React, { useState } from 'react'
import clsx from 'clsx'
import {
  IconUserRegistered,
  getUserRegisteredElementColors,
} from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

type UserLoginToolbarIconProps = {
  avatarUrl?: string | null
  className?: string
}

export const UserLoginToolbarIcon: React.FC<UserLoginToolbarIconProps> = ({
  avatarUrl,
  className,
}) => {
  const [failed, setFailed] = useState(false)
  const glyphClass = clsx(styles.toolbarUserChromeGlyph, className)

  if (avatarUrl && !failed) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={glyphClass}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span className={glyphClass} aria-hidden>
      <IconUserRegistered elementColors={getUserRegisteredElementColors()} />
    </span>
  )
}
