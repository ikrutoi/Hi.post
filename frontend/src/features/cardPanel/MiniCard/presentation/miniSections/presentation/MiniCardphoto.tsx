import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
import { selectCardphotoMiniPreview } from '@cardphoto/infrastructure/selectors'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { useCardEditorFacade } from '@entities/cardEditor/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  isMirrorCardphotoHydratedInEditor,
  isMirrorSectionAppliedToEditor,
} from '@cardPanel/application/helpers/mirrorSectionEditorSync'

export const MiniCardphoto = () => {
  const editorPreview = useAppSelector(selectCardphotoMiniPreview)
  const {
    centerStripListMirrorEnabled,
    mirrorInner,
    mirrorTargetLocalId,
  } = useRightListArchiveMini()
  const cartItems = useAppSelector(selectCartItems)
  const cardphotoApplied = useAppSelector(
    (s) => s.cardphoto.state?.appliedData ?? null,
  )
  const cardphotoAsset = useAppSelector(
    (s) => s.cardphoto.state?.assetData ?? null,
  )
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
  const sourcePostcard =
    mirrorTargetLocalId != null
      ? (cartItems.find((p) => p.localId === mirrorTargetLocalId) ?? null)
      : null
  const mirrorActive =
    centerStripListMirrorEnabled && mirrorInner?.cardphoto?.id != null
  const mirrorCopyInFactory =
    mirrorActive &&
    (isMirrorSectionAppliedToEditor('cardphoto', mirrorInner, sourcePostcard, {
      cardphotoAppliedData: cardphotoApplied,
      cardtextApplied: null,
      appliedRecipientAddress: null,
      appliedSenderAddress: null,
      selectedAroma: null,
      selectedDates: [],
    }) ||
      isMirrorCardphotoHydratedInEditor(sourcePostcard, cardphotoApplied) ||
      isMirrorCardphotoHydratedInEditor(sourcePostcard, cardphotoAsset))
  const photoPreview = mirrorCopyInFactory
    ? editorPreview
    : mirrorActive
      ? mirrorDisplayUrl
        ? { previewUrl: mirrorDisplayUrl, id: mirrorInner!.cardphoto.id }
        : null
      : editorPreview
  const previewImgOnError =
    mirrorCopyInFactory || !mirrorActive ? undefined : onMirrorPreviewError
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
