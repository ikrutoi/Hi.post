import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import { selectCardphotoMiniPreview } from '@cardphoto/infrastructure/selectors'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'

export const MiniCardphoto = () => {
  const photoPreview = useAppSelector(selectCardphotoMiniPreview)
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardphoto')

  // Пустое состояние: рамка и иконка уже у родительского `MiniCard` (как MiniEnvelope при count === 0).
  if (!photoPreview?.previewUrl) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.miniCardphoto,
        styles.visible,
        isHovered && styles.hovered,
      )}
      onMouseEnter={() => setHovered('cardphoto')}
      onMouseLeave={() => setHovered(null)}
    >
      <img
        key={photoPreview.id}
        src={photoPreview.previewUrl}
        alt="MiniCard photo"
        // className={clsx(
        //   styles.miniCardphoto,
        //   styles.visible,
        //   isHovered && styles.hovered,
        // )}
        // onMouseEnter={() => setHovered('cardphoto')}
        // onMouseLeave={() => setHovered(null)}
      />
    </div>
  )
}
