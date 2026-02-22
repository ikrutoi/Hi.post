import React from 'react'
import { PreviewStripItem } from '../PreviewStripItem/PreviewStripItem'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { PreviewStripProps } from './PreviewStrip.types'
import styles from './PreviewStrip.module.scss'
import clsx from 'clsx'
import { getToolbarIcon } from '@/shared/utils/icons'

const SLOT_COUNT = CARD_SCALE_CONFIG.maxPreviewToolbarRight

export const PreviewStrip: React.FC<PreviewStripProps> = ({
  items,
  containerHeight,
  className,
  onDelete,
  onSelectItem,
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
        const canSelect = item?.kind === 'address' && onSelectItem
        return (
          <div
            key={item ? item.id : `empty-${i}`}
            className={clsx(
              styles.stripSlot,
              canSelect && styles.stripSlotSelectable,
            )}
            style={{ height: `${slotHeight}px` }}
            role="listitem"
            onClick={
              canSelect
                ? (e) => {
                    if ((e.target as HTMLElement).closest(`.${styles.deleteButton}`)) return
                    onSelectItem(item)
                  }
                : undefined
            }
          >
            {item ? <PreviewStripItem item={item} /> : null}
            {item && onDelete && (
              <button
                type="button"
                className={clsx(styles.deleteButton)}
                aria-label="Delete section content"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item)
                }}
              >
                {getToolbarIcon({ key: 'clearInput' })}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
