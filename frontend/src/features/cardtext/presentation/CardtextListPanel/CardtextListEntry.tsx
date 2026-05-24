import React, { useMemo } from 'react'
import clsx from 'clsx'
import type { CardtextContent } from '@cardtext/domain/types'
import type { PanelDensity2Size } from '@shared/ui/icons'
import cellStyles from '@envelope/addressBook/presentation/AddressBookCell.module.scss'

const PREVIEW_COLOR: Record<CardtextContent['style']['color'], string> = {
  deepBlack: '#1a1a1b',
  blue: '#1e3a8a',
  burgundy: '#741b47',
  forestGreen: '#064e3b',
}

const PREVIEW_CHAR_LIMIT: Record<PanelDensity2Size, number> = {
  1: 320,
  2: 240,
}

type Props = {
  entry: CardtextContent
  onSelect: (entry: CardtextContent) => void
  isSelected?: boolean
  isFocused?: boolean
  density?: PanelDensity2Size
}

export const CardtextListEntry: React.FC<Props> = ({
  entry,
  onSelect,
  isSelected = false,
  isFocused = false,
  density = 1,
}) => {
  const { nameLine, previewLine } = useMemo(() => {
    const title = entry.title?.trim() ?? ''
    const plain = entry.plainText?.trim() ?? ''
    const charLimit = PREVIEW_CHAR_LIMIT[density]
    const preview =
      plain.length > 0
        ? plain.slice(0, charLimit) + (plain.length > charLimit ? '...' : '')
        : '?'
    return {
      nameLine: title.length > 0 ? title : '?',
      previewLine: preview,
    }
  }, [entry.title, entry.plainText, density])

  const previewColor =
    PREVIEW_COLOR[entry.style.color] ?? PREVIEW_COLOR.deepBlack

  const handleRowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
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
        <div className={clsx(cellStyles.text, cellStyles.templateTextBlock)}>
          <div className={clsx(cellStyles.nameLine, cellStyles.templateTitleText)}>
            {nameLine}
          </div>
          <div
            className={clsx(cellStyles.cityLine, cellStyles.templatePreviewText)}
            style={{ color: previewColor }}
          >
            {previewLine}
          </div>
        </div>
      </div>
    </div>
  )
}
