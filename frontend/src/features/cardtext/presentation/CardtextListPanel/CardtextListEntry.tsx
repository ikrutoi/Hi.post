import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { CardtextContent } from '@cardtext/domain/types'
import { getToolbarIcon } from '@shared/utils/icons'
import addressRowStyles from '@envelope/addressBook/presentation/AddressListRow.module.scss'

const PREVIEW_COLOR: Record<CardtextContent['style']['color'], string> = {
  deepBlack: '#1a1a1b',
  blue: '#1e3a8a',
  burgundy: '#741b47',
  forestGreen: '#064e3b',
}

/** Density 1 + row actions ? ??????? ?????? ??????, ??? ? ???????? ????? ? edit/delete. */
const ADDRESS_LIST_DENSITY_LARGEST = 1 as const

type Props = {
  entry: CardtextContent
  onSelect: (entry: CardtextContent) => void
  onEdit?: (entry: CardtextContent) => void
  onDelete?: (id: string) => void
  isSelected?: boolean
  isFocused?: boolean
  isEditActive?: boolean
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false,
  isFocused = false,
  isEditActive = false,
}) => {
  const { nameLine, previewLine } = useMemo(() => {
    const title = entry.title?.trim() ?? ''
    const plain = entry.plainText?.trim() ?? ''
    const preview =
      plain.length > 0
        ? plain.slice(0, 72) + (plain.length > 72 ? '?' : '')
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
      className={addressRowStyles.root}
      data-cardtext-template-entry
      data-density-level={ADDRESS_LIST_DENSITY_LARGEST}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-has-row-actions={showRowActions ? 'true' : undefined}
      onMouseDown={handleRowMouseDown}
    >
      <div className={addressRowStyles.body}>
        <div className={addressRowStyles.field}>
          <div className={addressRowStyles.nameLine}>{nameLine}</div>
          <div
            className={addressRowStyles.cityLine}
            style={{ color: previewColor }}
          >
            {previewLine}
          </div>
        </div>
        {showRowActions && (
          <div
            className={addressRowStyles.rowActions}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit != null && (
              <button
                type="button"
                className={clsx(
                  addressRowStyles.rowActionButton,
                  isEditActive && addressRowStyles.rowActionButtonActive,
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
                className={clsx(
                  addressRowStyles.rowActionButton,
                  addressRowStyles.rowActionButtonDelete,
                )}
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
