import React from 'react'
import clsx from 'clsx'
import type { AromaCardPiePreviewState } from '@aroma/application/hooks/useAromaCardPiePreview'
import styles from './AromaCardPiePreview.module.scss'

export const AromaCardPiePreview: React.FC<{
  preview: AromaCardPiePreviewState
}> = ({ preview }) => {
  const image = preview.mounted ?? preview.target

  return (
    <div
      className={clsx(
        styles.preview,
        preview.phase === 'out' && styles.fadeOut,
      )}
      aria-label={image != null ? 'Selected aroma preview' : undefined}
      aria-hidden={image == null ? true : undefined}
    >
      {image != null ? (
        <img
          key={image.index}
          src={image.src}
          alt={image.index === 0 ? '' : `Aroma slot ${image.index}`}
          decoding="async"
          draggable={false}
        />
      ) : null}
    </div>
  )
}
