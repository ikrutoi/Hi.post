import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetDisplayPreviewUrl,
} from '@cardphoto/infrastructure/selectors'
import styles from './CardphotoView.module.scss'
import { CardphotoStage } from '../CardphotoStage'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'

type Props = {
  className?: string
  titleStripEditing?: boolean
}

export const CardphotoView: React.FC<Props> = ({
  className,
  titleStripEditing,
}) => {
  const activeImage = useAppSelector(selectActiveImage)
  const previewUrl = useAppSelector(selectCardphotoAssetDisplayPreviewUrl)
  const showEmptyPlaceholder = !activeImage || !previewUrl

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
    </div>
  )
}
