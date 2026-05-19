import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { CardtextContent } from '@cardtext/domain/types'
import { getToolbarIcon } from '@shared/utils/icons'
import type { PanelDensity2Size } from '@shared/ui/icons'
import cellStyles from '@envelope/addressBook/presentation/AddressBookCell.module.scss'
import styles from './CardtextListPanel.module.scss'

const PREVIEW_COLOR: Record<CardtextContent['style']['color'], string> = {
  deepBlack: '#1a1a1b',
  blue: '#1e3a8a',
  burgundy: '#741b47',
  forestGreen: '#064e3b',
}

type Props = {
  entry: CardtextContent
  onSelect: (entry: CardtextContent) => void
  onEdit?: (entry: CardtextContent) => void
  onDelete?: (id: string) => void
  isSelected?: boolean
  isFocused?: boolean
  isEditActive?: boolean
  density?: PanelDensity2Size
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false,
  isFocused = false,
  isEditActive = false,
  density = 1,
}) => {
  const { nameLine, previewLine } = useMemo(() => {
    const title = entry.title?.trim() ?? ''
    const plain = entry.plainText?.trim() ?? ''
    const preview =
      plain.length > 0
        ? plain.slice(0, 220) + (plain.length > 220 ? '...' : '')
        : '?'
    return {
      nameLine: title.length > 0 ? title : '?',
      previewLine: preview,
    }
  }, [entry.title, entry.plainText])

  const previewColor =
    PREVIEW_COLOR[entry.style.color] ?? PREVIEW_COLOR.deepBlack

  const showRowActions = onEdit != null || onDelete != null

  const handleRowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    onSelect(entry)
  }

  return (
    <div
      className={cellStyles.root}
      data-cardtext-template-entry
      data-density-level={density}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      onMouseDown={handleRowMouseDown}
    >
      <div className={cellStyles.body}>
        <div className={cellStyles.text}>
          <div className={clsx(cellStyles.nameLine, styles.templateTitleText)}>
            {nameLine}
          </div>
          <div
            className={clsx(cellStyles.cityLine, styles.templatePreviewText)}
            style={{ color: previewColor }}
          >
            {previewLine}
          </div>
        </div>
        {showRowActions && (
          <div
            className={cellStyles.actions}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit != null && (
              <button
                type="button"
                className={clsx(
                  cellStyles.actionButton,
                  isEditActive && cellStyles.actionButtonActive,
                )}
                aria-label="Edit text template"
                title="Edit text template"
                aria-pressed={isEditActive}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(entry)
                }}
              >
                {getToolbarIcon({ key: 'edit' })}
              </button>
            )}
            {onDelete != null && (
              <button
                type="button"
                className={cellStyles.actionButton}
                aria-label="Delete text template"
                title="Delete text template"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(entry.id)
                }}
              >
                {getToolbarIcon({ key: 'delete' })}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
