import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import styles from './MiniAroma.module.scss'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import clsx from 'clsx'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

interface MiniAromaProps {}

export const MiniAroma: React.FC<MiniAromaProps> = () => {
  const selectedAroma = useAppSelector(selectSelectedAroma)
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('aroma')
  const { centerStripListMirrorEnabled, mirrorInner } = useRightListArchiveMini()

  if (centerStripListMirrorEnabled && mirrorInner == null) {
    return null
  }

  if (centerStripListMirrorEnabled && mirrorInner?.aroma) {
    const idx = mirrorInner.aroma.index
    const imageAroma = idx != null ? AROMA_IMAGES[idx] : undefined
    if (!imageAroma) return null
    return (
      <div
        className={clsx(styles.miniAroma, isHovered && styles.hovered)}
        onMouseEnter={() => setHovered('aroma')}
        onMouseLeave={() => setHovered(null)}
      >
        <img
          className={styles.miniAromaImg}
          alt={mirrorInner.aroma.index === 0 ? '' : `Aroma slot ${mirrorInner.aroma.index}`}
          src={imageAroma}
        />
      </div>
    )
  }

  if (!selectedAroma) return null

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
        alt={
          selectedAroma.index === 0 ? '' : `Aroma slot ${selectedAroma.index}`
        }
        src={imageAroma}
      />
    </div>
  )
}
