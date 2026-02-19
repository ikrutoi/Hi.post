import React from 'react'
import { useAromaFacade } from '@aroma/application/facades'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import styles from './MiniAroma.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'

interface MiniAromaProps {}

export const MiniAroma: React.FC<MiniAromaProps> = () => {
  const { selectedAroma, clearAroma } = useAromaFacade()
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
      <button
        className={clsx(styles.previewButton, styles.previewButtonDelete)}
        aria-label="Delete section content"
        onClick={(e) => {
          e.stopPropagation()
          clearAroma()
          // removeCropId(cropId)
        }}
      >
        {getToolbarIcon({ key: 'clearInput' })}
      </button>
    </div>
  )
}
