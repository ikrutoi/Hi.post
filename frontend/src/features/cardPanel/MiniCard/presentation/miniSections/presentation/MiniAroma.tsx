import React from 'react'
import { useAromaFacade } from '@aroma/application/facades'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import styles from './MiniAroma.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import clsx from 'clsx'

interface MiniAromaProps {}

export const MiniAroma: React.FC<MiniAromaProps> = () => {
  const { selectedAroma } = useAromaFacade()
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('aroma')

  if (!selectedAroma) return

  const imageAroma = AROMA_IMAGES[selectedAroma.index]

  if (!imageAroma) return null

  return (
    <div
      className={clsx(styles.miniAroma, isHovered && styles.hovered)}
      onMouseEnter={() => setHovered('aroma')}
      onMouseLeave={() => setHovered(null)}
    >
      <img
        className={styles.miniAromaImg}
        alt={selectedAroma.name}
        src={imageAroma}
      />
    </div>
  )
}
