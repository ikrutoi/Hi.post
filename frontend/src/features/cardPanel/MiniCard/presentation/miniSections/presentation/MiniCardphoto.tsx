import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'

export const MiniCardphoto = () => {
  const photoPreview = useAppSelector(selectCardphotoPreview)
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardphoto')

  if (!photoPreview?.previewUrl) return null

  return (
    <img
      key={photoPreview.id}
      className={clsx(
        styles.miniCardphoto,
        styles.visible,
        isHovered && styles.hovered,
      )}
      src={photoPreview.previewUrl}
      alt="MiniCard photo"
      onMouseEnter={() => setHovered('cardphoto')}
      onMouseLeave={() => setHovered(null)}
    />
  )
}
