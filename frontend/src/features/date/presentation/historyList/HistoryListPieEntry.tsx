import React from 'react'
import { useAppSelector } from '@app/hooks'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { selectListArchiveCardPieBundle } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'
import type { PostcardStatus } from '@entities/postcard'
import type { HistoryListEntryVariant } from './HistoryListEntry'
import styles from './HistoryListPieEntry.module.scss'

export type HistoryListPieEntryProps = {
  postcardLocalId?: number
  dateLabel: string
  detailLine?: string
  variant?: HistoryListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onSelect?: () => void
  isSelected?: boolean
}

export const HistoryListPieEntry: React.FC<HistoryListPieEntryProps> = ({
  postcardLocalId,
  dateLabel,
  detailLine,
  variant = 'default',
  previewStatus,
  previewIsProcessed,
  onSelect,
  isSelected = false,
}) => {
  const pieBundle = useAppSelector((state) =>
    postcardLocalId != null
      ? selectListArchiveCardPieBundle(
          state,
          String(postcardLocalId),
          'history',
        )
      : null,
  )

  const interactive = Boolean(onSelect)
  const labelForAria = detailLine ? `${dateLabel}, ${detailLine}` : dateLabel
  const pieInner = pieBundle?.currentData.data
  const pieSections = pieBundle?.sections
  const pieStatus =
    previewStatus && !previewIsProcessed ? previewStatus : undefined

  return (
    <div
      className={styles.root}
      data-selected={isSelected ? 'true' : undefined}
      data-inactive={variant === 'inactive' ? 'true' : undefined}
      data-clickable={interactive ? 'true' : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? labelForAria : undefined}
      onClick={interactive ? () => onSelect?.() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
    >
      {pieInner != null && pieSections != null ? (
        <CardPie
          fillContainer
          station="left"
          leftPieCenterDisc
          hideEmptySectorPlaceholders
          sectorsInteractive={false}
          status={pieStatus}
          pieInner={pieInner}
          pieSections={pieSections}
        />
      ) : null}
    </div>
  )
}
