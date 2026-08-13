import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetToolbar,
  selectCardphotoViewDismissIconKey,
} from '@cardphoto/infrastructure/selectors'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import styles from './CardphotoView.module.scss'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import { CardphotoStage } from '../CardphotoStage'

type Props = {
  className?: string
  onDelete?: () => void
  titleStripEditing?: boolean
}

export const CardphotoView: React.FC<Props> = ({
  className,
  onDelete,
  titleStripEditing,
}) => {
  const activeImage = useAppSelector(selectActiveImage)
  const assetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const viewDismissIconKey = useAppSelector(selectCardphotoViewDismissIconKey)
  const createToolbarState = useAppSelector(
    selectToolbarSectionState('cardphotoCreate'),
  )
  const { isMobileLayout } = useSizeFacade()
  const isCreateCropActive = createToolbarState?.crop?.state === 'active'
  const showEmptyPlaceholder = !activeImage
  const showCreateOverlay =
    assetToolbar === 'cardphotoCreate' && !!activeImage
  const showViewOverlay = assetToolbar === 'cardphotoView' && !!activeImage
  const viewDismissKey =
    viewDismissIconKey ??
    (activeImage?.status === 'inLine' ? 'close' : 'delete')
  const canDismissView =
    activeImage?.status === 'inLine' ||
    activeImage?.status === 'outLine' ||
    activeImage?.status === 'processed'
  const showDeleteOverlay =
    !isMobileLayout &&
    !!onDelete &&
    ((showViewOverlay && canDismissView) ||
      (showCreateOverlay && !isCreateCropActive))
  const overlayIconKey = showCreateOverlay ? 'delete' : viewDismissKey
  const overlayAriaLabel = showCreateOverlay
    ? 'Delete image'
    : viewDismissKey === 'close'
      ? 'Clear selection'
      : 'Delete image'
  const overlayTitle = showCreateOverlay
    ? 'Delete'
    : viewDismissKey === 'close'
      ? 'Clear'
      : 'Delete'

  return (
    <div
      className={clsx(
        styles.viewContainer,
        titleStripEditing && styles.viewContainerTitleStripEditing,
        className,
      )}
    >
      <div className={styles.stageRoot}>
        <CardphotoStage />
      </div>
      {showEmptyPlaceholder ? (
        <div className={styles.emptyPlaceholderIcon} aria-hidden>
          <IconSectionMenuCardphoto />
        </div>
      ) : null}
      {showDeleteOverlay ? (
        <div className={styles.viewOverlayActions}>
          <button
            type="button"
            className={styles.viewDeleteBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
            aria-label={overlayAriaLabel}
            title={overlayTitle}
          >
            {getToolbarIcon({ key: overlayIconKey })}
          </button>
        </div>
      ) : null}
    </div>
  )
}
