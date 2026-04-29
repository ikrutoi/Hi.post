import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import { selectCardphotoMiniPreview } from '@cardphoto/infrastructure/selectors'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

export const MiniCardphoto = () => {
  const editorPreview = useAppSelector(selectCardphotoMiniPreview)
  const { centerStripListMirrorEnabled, mirrorInner } = useRightListArchiveMini()
  const photoPreview =
    mirrorInner?.cardphoto?.previewUrl != null &&
    mirrorInner.cardphoto.previewUrl !== ''
      ? {
          previewUrl: mirrorInner.cardphoto.previewUrl,
          id: mirrorInner.cardphoto.id,
        }
      : centerStripListMirrorEnabled
        ? null
        : editorPreview
  const { setHovered, isSectionHovered } = useCardEditorFacade()
  const isHovered = isSectionHovered('cardphoto')

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
      />
    </div>
  )
}
