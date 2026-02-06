import React from 'react'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import { useActiveImageUrl } from '../application/hooks'

export const MiniCardphoto = () => {
  const url = useActiveImageUrl()

  if (!url) return null

  return (
    <img
      className={clsx(styles.miniCardphoto, url && styles.visible)}
      src={url}
      alt="MiniCard photo"
    />
  )
}
