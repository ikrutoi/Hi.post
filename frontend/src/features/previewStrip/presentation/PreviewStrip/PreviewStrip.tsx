import React from 'react'
import { PreviewStripItem } from '../PreviewStripItem/PreviewStripItem'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { PreviewStripProps } from './PreviewStrip.types'
import styles from './PreviewStrip.module.scss'

const SLOT_COUNT = CARD_SCALE_CONFIG.maxPreviewToolbarRight

export const PreviewStrip: React.FC<PreviewStripProps> = ({
  items,
  containerHeight,
  className,
}) => {
  const slotHeight = containerHeight / SLOT_COUNT

  return (
    <div
      className={`${styles.strip} ${className ?? ''}`.trim()}
      style={{ height: `${containerHeight}px` }}
      role="list"
    >
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const item = items[i]
        return (
          <div
            key={item ? item.id : `empty-${i}`}
            className={styles.stripSlot}
            style={{ height: `${slotHeight}px` }}
            role="listitem"
          >
            {item ? <PreviewStripItem item={item} /> : null}
          </div>
        )
      })}
    </div>
  )
}
