import React from 'react'
import clsx from 'clsx'
import styles from './CardphotoView.module.scss'

type Props = {
  previewUrl: string | null
  className?: string
}

/**
 * Read-only cardphoto view (preview).
 * Visually mirrors the outer container style of `CardtextView`, but without any title UI.
 */
export const CardphotoView: React.FC<Props> = ({ previewUrl, className }) => {
  return (
    <div className={clsx(styles.viewContainer, className)}>
      {previewUrl ? (
        <img
          className={styles.photo}
          src={previewUrl}
          alt="Card photo preview"
          draggable={false}
        />
      ) : null}
    </div>
  )
}

