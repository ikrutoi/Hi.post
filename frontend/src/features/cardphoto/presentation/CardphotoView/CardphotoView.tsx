import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetToolbar,
} from '@cardphoto/infrastructure/selectors'
import styles from './CardphotoView.module.scss'
import { IconSectionMenuCardphoto, IconX } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import { CardphotoStage } from '../CardphotoStage'

type Props = {
  className?: string
  onClose?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const CardphotoView: React.FC<Props> = ({
  className,
  onClose,
  onEdit,
  onDelete,
}) => {
  const activeImage = useAppSelector(selectActiveImage)
  const assetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const showEmptyPlaceholder = !activeImage
  const showViewOverlay = assetToolbar === 'cardphotoView' && !!activeImage
  const canEditTemplate = activeImage?.status === 'inLine'

  return (
    <div className={clsx(styles.viewContainer, className)}>
      <div className={styles.stageRoot}>
        <CardphotoStage />
      </div>
      {showEmptyPlaceholder ? (
        <div className={styles.emptyPlaceholderIcon} aria-hidden>
          <IconSectionMenuCardphoto />
        </div>
      ) : null}
      {showViewOverlay && onClose ? (
        <button
          type="button"
          className={styles.viewCloseBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="Close image preview"
          title="Close"
        >
          <IconX />
        </button>
      ) : null}
      {showViewOverlay && (onEdit || onDelete) ? (
        <div
          className={styles.viewActions}
          onClick={(e) => e.stopPropagation()}
        >
          {canEditTemplate && onEdit ? (
            <button
              type="button"
              className={styles.viewActionButton}
              aria-label="Edit image"
              title="Edit image"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              {getToolbarIcon({ key: 'edit' })}
            </button>
          ) : null}
          {canEditTemplate && onDelete ? (
            <button
              type="button"
              className={styles.viewActionButton}
              aria-label="Delete image"
              title="Delete image"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              {getToolbarIcon({ key: 'delete' })}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
