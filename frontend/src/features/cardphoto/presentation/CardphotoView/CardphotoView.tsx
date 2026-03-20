import React from 'react'
import clsx from 'clsx'
import styles from './CardphotoView.module.scss'
import { IconSectionMenuCardphoto } from '@shared/ui/icons'
import { ImageCrop } from '../ImageCrop'

type Props = {
  previewUrl: string | null
  className?: string
}

export const CardphotoView: React.FC<Props> = ({ previewUrl, className }) => {
  return (
    <div className={clsx(styles.viewContainer, className)}>
      <div className={styles.fileDialogHost} aria-hidden>
        <ImageCrop />
      </div>
      {!previewUrl ? (
        <>
          <div className={styles.emptyPlaceholderIcon} aria-hidden>
            <IconSectionMenuCardphoto />
          </div>
        </>
      ) : (
        <img
          className={styles.photo}
          src={previewUrl}
          alt="Card photo preview"
          draggable={false}
        />
      )}
    </div>
  )
}
