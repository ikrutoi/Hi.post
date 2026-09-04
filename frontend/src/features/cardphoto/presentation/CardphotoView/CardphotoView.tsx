import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetToolbar,
  selectIsCardphotoCreateSession,
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
  const isCardphotoCreateSession = useAppSelector(
    selectIsCardphotoCreateSession,
  )
  const createToolbarState = useAppSelector(
    selectToolbarSectionState('cardphotoCreate'),
  )
  const { isMobileLayout } = useSizeFacade()
  const isCreateCropActive = createToolbarState?.crop?.state === 'active'
  const showEmptyPlaceholder = !activeImage
  const showCreateOverlay =
    assetToolbar === 'cardphotoCreate' &&
    isCardphotoCreateSession &&
    !!activeImage
  const showDeleteOverlay =
    !isMobileLayout &&
    !!onDelete &&
    showCreateOverlay &&
    !isCreateCropActive

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
            aria-label="Delete image"
            title="Delete"
          >
            {getToolbarIcon({ key: 'delete' })}
          </button>
        </div>
      ) : null}
    </div>
  )
}
