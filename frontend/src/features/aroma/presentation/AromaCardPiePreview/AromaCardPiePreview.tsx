import React from 'react'
import clsx from 'clsx'
import type { AromaCardPiePreviewState } from '@aroma/application/hooks/useAromaCardPiePreview'
import styles from './AromaCardPiePreview.module.scss'

export const AromaCardPiePreview: React.FC<{
  preview: AromaCardPiePreviewState
}> = ({ preview }) => {
  return (
    <div
      className={clsx(
        styles.preview,
        preview.phase === 'in' && styles.fadeIn,
        preview.phase === 'out' && styles.fadeOut,
      )}
      style={
        preview.phase === 'shown'
          ? { opacity: 1 }
          : preview.phase === 'hidden'
            ? { opacity: 0 }
            : {
                animationDuration: `${preview.fadeMs}ms`,
              }
      }
      aria-label={
        preview.mounted != null ? 'Selected aroma preview' : undefined
      }
      aria-hidden={preview.mounted == null ? true : undefined}
    >
      {preview.mounted != null ? (
        <img
          key={preview.mounted.index}
          src={preview.mounted.src}
          alt={
            preview.mounted.index === 0
              ? ''
              : `Aroma slot ${preview.mounted.index}`
          }
          decoding="async"
          draggable={false}
        />
      ) : null}
    </div>
  )
}
