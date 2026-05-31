import React, { useState } from 'react'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './Toolbar.module.scss'

type UserLoginToolbarIconProps = {
  avatarUrl: string
}

export const UserLoginToolbarIcon: React.FC<UserLoginToolbarIconProps> = ({
  avatarUrl,
}) => {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return getToolbarIcon({ key: 'userLogin' })
  }

  return (
    <img
      src={avatarUrl}
      alt=""
      className={styles.toolbarUserAvatar}
      onError={() => setFailed(true)}
    />
  )
}
