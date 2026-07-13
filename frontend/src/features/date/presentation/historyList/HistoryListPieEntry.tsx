import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { selectListArchiveCardPieBundle } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'
import { emptyCardPieInnerData } from '@features/cardPie/infrastructure/planEntryCardPieViewModel'
import {
  buildPieSectionFlagsFromInner,
  type CardPieInnerData,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import type { PostcardStatus } from '@entities/postcard'
import styles from './HistoryListPieEntry.module.scss'

function applyListPreviewToPieInner(
  inner: CardPieInnerData,
  displayUrl: string | null,
): CardPieInnerData {
  if (!displayUrl?.trim()) return inner
  return {
    ...inner,
    cardphoto: {
      ...inner.cardphoto,
      previewUrl: displayUrl,
      factoryDisplayUrl: displayUrl,
    },
  }
}

export type HistoryListEntryVariant = 'default' | 'inactive'

export type HistoryListPieEntryProps = {
  cardId?: string
  postcardLocalId?: number
  previewUrl?: string | null
  previewAllowBlob?: boolean
  dateLabel: string
  detailLine?: string
  variant?: HistoryListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onSelect?: () => void
  isSelected?: boolean
}

export const HistoryListPieEntry: React.FC<HistoryListPieEntryProps> = ({
  cardId,
  postcardLocalId,
  previewUrl,
  previewAllowBlob,
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
  const { displayUrl } = useListCardPreviewUrl(cardId, previewUrl, {
    previewIsProcessed: previewAllowBlob ?? previewIsProcessed,
  })

  const interactive = Boolean(onSelect)
  const labelForAria = detailLine ? `${dateLabel}, ${detailLine}` : dateLabel
  const pieInner = useMemo(() => {
    const base = pieBundle?.currentData.data
    if (base) {
      return applyListPreviewToPieInner(base, displayUrl)
    }
    if (!displayUrl?.trim()) return null
    return {
      ...emptyCardPieInnerData(),
      cardphoto: {
        previewUrl: displayUrl,
        factoryDisplayUrl: displayUrl,
        isComplete: true,
        id: cardId ?? 'history-list',
      },
    }
  }, [pieBundle, displayUrl, cardId])
  const pieSections = useMemo(() => {
    if (pieInner == null) return null
    return buildPieSectionFlagsFromInner(
      pieInner,
      pieBundle?.sections?.envelope ?? false,
    )
  }, [pieInner, pieBundle])
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
