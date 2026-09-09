import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectActiveImage } from '@cardphoto/infrastructure/selectors'
import styles from './CardphotoView.module.scss'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import { CardphotoStage } from '../CardphotoStage'

type Props = {
  className?: string
  titleStripEditing?: boolean
}

export const CardphotoView: React.FC<Props> = ({
  className,
  titleStripEditing,
}) => {
  const activeImage = useAppSelector(selectActiveImage)
  const showEmptyPlaceholder = !activeImage

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
