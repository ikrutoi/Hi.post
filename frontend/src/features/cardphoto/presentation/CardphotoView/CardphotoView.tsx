import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetToolbar,
} from '@cardphoto/infrastructure/selectors'
import styles from './CardphotoView.module.scss'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import { CardphotoStage } from '../CardphotoStage'

type Props = {
  className?: string
  onDelete?: () => void
}

export const CardphotoView: React.FC<Props> = ({
  className,
  onDelete,
}) => {
  const activeImage = useAppSelector(selectActiveImage)
  const assetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const showEmptyPlaceholder = !activeImage
  const showViewOverlay = assetToolbar === 'cardphotoView' && !!activeImage
  const canDeleteTemplate = activeImage?.status === 'inLine'

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
      {showViewOverlay && canDeleteTemplate && onDelete ? (
        <button
          type="button"
          className={styles.viewDeleteBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Delete image template"
          title="Delete template"
        >
          {getToolbarIcon({ key: 'delete' })}
        </button>
      ) : null}
    </div>
  )
}
