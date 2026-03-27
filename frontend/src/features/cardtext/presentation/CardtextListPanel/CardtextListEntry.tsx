import React from 'react'
import type { CardtextContent } from '@cardtext/domain/types'
import styles from './CardtextListEntry.module.scss'

type Props = {
  entry: CardtextContent
  onSelect: (entry: CardtextContent) => void
  isStarred?: boolean
  onToggleStar?: () => void
  isSelected?: boolean
  isFocused?: boolean
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  isStarred = false,
  onToggleStar,
  isSelected = false,
  isFocused = false,
}) => {
  const colorMap: Record<CardtextContent['style']['color'], string> = {
    deepBlack: '#1a1a1b',
    blue: '#1e3a8a',
    burgundy: '#741b47',
    forestGreen: '#064e3b',
  }
  const previewColor = colorMap[entry.style.color] ?? colorMap.deepBlack

  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-no-star={!onToggleStar ? 'true' : undefined}
    >
      {onToggleStar && (
        <button
          type="button"
          className={styles.star}
          data-starred={isStarred ? 'true' : undefined}
          onClick={(e) => {
            e.stopPropagation()
            onToggleStar()
          }}
          aria-label={isStarred ? 'Remove from quick access' : 'Add to quick access'}
          title={isStarred ? 'Remove from quick access' : 'Add to quick access'}
        >
          ★
        </button>
      )}
      <div className={styles.field}>
        <div className={styles.info} onClick={() => onSelect(entry)}>
          {entry.title ? <strong>{entry.title}</strong> : null}
          <div style={{ color: previewColor }}>
            {entry.plainText
              ? entry.plainText.trim().slice(0, 80) +
                (entry.plainText.length > 80 ? '…' : '')
              : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}
