import React from 'react'
import styles from './MiniCardphoto.module.scss'
import { useMiniCardphoto } from '../application/hooks'

interface MiniCardphotoProps {}

export const MiniCardphoto: React.FC<MiniCardphotoProps> = () => {
  const { miniCardUrl, isVisible } = useMiniCardphoto()

  if (!miniCardUrl) return null

  return (
    <img
      className={`${styles.miniCardphoto} ${isVisible ? styles.visible : ''}`}
      src={miniCardUrl}
      alt="MiniCard photo"
    />
  )
}
