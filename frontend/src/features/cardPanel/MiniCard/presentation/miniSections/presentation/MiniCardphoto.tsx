import React from 'react'
import styles from './MiniCardphoto.module.scss'
import { useMiniCardphoto } from '../application/hooks'

interface MiniCardphotoProps {
  sizeMiniCard: {
    width: number
    height: number
  }
}

export const MiniCardphoto: React.FC<MiniCardphotoProps> = ({
  sizeMiniCard,
}) => {
  const { miniCardUrl, isVisible } = useMiniCardphoto()

  if (!miniCardUrl) return null

  return (
    <img
      className={`${styles.miniCardphoto} ${isVisible ? styles.visible : ''}`}
      src={miniCardUrl}
      alt="MiniCard photo"
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
        position: 'absolute',
      }}
    />
  )
}
