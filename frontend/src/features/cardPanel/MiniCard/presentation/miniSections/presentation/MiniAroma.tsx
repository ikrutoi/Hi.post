import React from 'react'
import { useAromaFacade } from '@aroma/application/facades'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import styles from './MiniAroma.module.scss'

interface MiniAromaProps {}

export const MiniAroma: React.FC<MiniAromaProps> = () => {
  const { state: stateAroma } = useAromaFacade()
  const { selectedAroma } = stateAroma

  if (!selectedAroma) return

  const imageAroma = AROMA_IMAGES[selectedAroma.index]

  if (!imageAroma) return null

  return (
    <div className={styles.miniAroma}>
      <img
        className={styles.miniAromaImg}
        alt={selectedAroma.name}
        src={imageAroma}
        // style={{ height: `${0.9 * heightMinicard}px` }}
      />
    </div>
  )
}
