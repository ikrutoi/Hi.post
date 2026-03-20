import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectActiveImage } from '@cardphoto/infrastructure/selectors'
import styles from './CardphotoView.module.scss'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import { CardphotoStage } from '../CardphotoStage'

type Props = {
  className?: string
}

/**
 * Оболочка области превью: плейсхолдер без активного фото и сцена редактирования (файл + кроп).
 */
export const CardphotoView: React.FC<Props> = ({ className }) => {
  const activeImage = useAppSelector(selectActiveImage)
  const showEmptyPlaceholder = !activeImage

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
    </div>
  )
}
