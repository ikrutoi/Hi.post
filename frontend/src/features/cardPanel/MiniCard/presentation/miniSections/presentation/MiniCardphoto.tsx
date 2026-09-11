import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import { selectCardphotoMiniPreview } from '@cardphoto/infrastructure/selectors'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'

export const MiniCardphoto = () => {
  const editorPreview = useAppSelector(selectCardphotoMiniPreview)
  const { centerStripListMirrorEnabled, mirrorInner } = useRightListArchiveMini()
  const mirrorFallback =
    mirrorInner?.cardphoto?.previewUrl != null &&
    mirrorInner.cardphoto.previewUrl !== ''
      ? mirrorInner.cardphoto.previewUrl
      : null
  const { displayUrl: mirrorDisplayUrl, onPreviewImgError: onMirrorPreviewError } =
    useListCardPreviewUrl(
      mirrorInner?.cardphoto?.id,
      mirrorFallback,
    )
  const usingMirrorPreview = mirrorInner?.cardphoto?.id != null
  const photoPreview = usingMirrorPreview
    ? mirrorDisplayUrl
      ? { previewUrl: mirrorDisplayUrl, id: mirrorInner!.cardphoto.id }
      : null
    : centerStripListMirrorEnabled
      ? null
      : editorPreview
  const previewImgOnError = usingMirrorPreview ? onMirrorPreviewError : undefined
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
        onError={previewImgOnError}
      />
    </div>
  )
}
