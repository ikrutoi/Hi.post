import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { IconHistory } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { type HistoryListEntryVariant } from './historyList/HistoryListEntry'
import type { PostcardStatus } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import styles from './HistoryListPanel.module.scss'
import { PostcardStatusLegend } from './postcardStatusLegend/PostcardStatusLegend'
import { HistoryListEntry } from './historyList/HistoryListEntry'
import clsx from 'clsx'
import type { IconKey } from '@shared/config/constants'
import type { PanelDensity2Size } from '@shared/ui/icons'
import { PostcardIndicator } from '@toolbar/presentation/PostcardIndictor'
import {
  selectHistoryListPanelDensity,
  selectHistoryListSortMode,
} from '@date/calendar/infrastructure/selectors'
import {
  getHistoryListSortEmphasis,
  sortHistoryListEntries,
  type HistoryListSortEmphasis,
} from '@date/application/helpers/historyListSort'
import { notebookTabHistoryClicked } from '@date/calendar/application/orchestration/notebookOrchestration.events'

export type HistoryListPanelItem = {
  id: string
  cardId?: string
  /** Для строк из `cart.items` — переключение правого CardPie, как в корзине. */
  postcardLocalId?: number
  sourceDate?: DispatchDate
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: HistoryListEntryVariant
  previewStatus?: PostcardStatus
  /** Скрыть индикатор статуса (слот редактора). */
  previewIsProcessed?: boolean
  /** Разрешить blob:/сессионное превью в `useListCardPreviewUrl`. */
  previewAllowBlob?: boolean
}

type Props = {
  onClose: () => void
  entries?: HistoryListPanelItem[]
  /** Выбранная открытка для подсветки строки и правого CardPie. */
  listSelectedLocalId?: number | null
  onSelectEntry?: (item: HistoryListPanelItem) => void
  /** True if postcards exist before status filter (keeps legend colors when list is filtered empty). */
  hasUnderlyingHistoryEntries?: boolean
  /** Число открыток по статусу (до фильтра) — для бейджей в легенде. */
  legendStatusCounts?: Record<PostcardStatus, number>
  /** Клик по иконке статуса переключает месяц календаря (футер cart/history). */
  calendarHistoryStripLegend?: boolean
  calendarFooterAlwaysEnabled?: boolean
  calendarCartHistoryFooter?: boolean
  /** Мобильный список: иконка «Дата» вместо истории. */
  leadIconKeyOverride?: IconKey
  // section: 'date' | 'history'
}

const HistoryListPanelRow: React.FC<{
  item: HistoryListPanelItem
  listSelectedLocalId?: number | null
  onSelectEntry?: (item: HistoryListPanelItem) => void
  densityLevel: PanelDensity2Size
  sortEmphasis?: HistoryListSortEmphasis
}> = ({ item, listSelectedLocalId, onSelectEntry, densityLevel, sortEmphasis }) => {
  const { displayUrl, onPreviewImgError } = useListCardPreviewUrl(
    item.cardId,
    item.previewUrl,
    {
      previewIsProcessed: item.previewAllowBlob ?? item.previewIsProcessed,
    },
  )

  return (
    <HistoryListEntry
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      onPreviewImgError={onPreviewImgError}
      detailLine={item.detailLine}
      variant={item.variant}
      previewStatus={item.previewStatus}
      previewIsProcessed={item.previewIsProcessed}
      onSelect={
        onSelectEntry && item.variant !== 'inactive'
          ? () => onSelectEntry(item)
          : undefined
      }
      isSelected={
        item.postcardLocalId != null &&
        item.postcardLocalId === listSelectedLocalId
      }
      densityLevel={densityLevel}
      sortEmphasis={sortEmphasis}
    />
  )
}

export const HistoryListPanel: React.FC<Props> = ({
  onClose,
  entries = [],
  listSelectedLocalId = null,
  onSelectEntry,
  hasUnderlyingHistoryEntries,
  legendStatusCounts,
  calendarHistoryStripLegend = false,
  calendarFooterAlwaysEnabled = false,
  calendarCartHistoryFooter = false,
  leadIconKeyOverride,
  // section,
}) => {
  const dispatch = useAppDispatch()
  const historyListSortMode = useAppSelector(selectHistoryListSortMode)
  const historyListPanelDensity = useAppSelector(selectHistoryListPanelDensity)
  const sortEmphasis = getHistoryListSortEmphasis(historyListSortMode)
  const sortedEntries = useMemo(
    () => sortHistoryListEntries(entries, historyListSortMode),
    [entries, historyListSortMode],
  )

  const hasRows = sortedEntries.length > 0
  const listContentKey = sortedEntries.map((e) => e.id).join('|')
  const legendTreatAsEmpty =
    hasUnderlyingHistoryEntries === undefined
      ? !hasRows
      : !hasUnderlyingHistoryEntries

  const handleLeadIconClick = useCallback(() => {
    if (leadIconKeyOverride == null) return
    dispatch(notebookTabHistoryClicked())
  }, [dispatch, leadIconKeyOverride])

  return (
    <div
      className={clsx(styles.panel, !hasRows && styles.panelEmptyNoToolbar)}
    >
      <ListPanelStackedHeader
        leadIconKey={leadIconKeyOverride ?? 'listHistory'}
        cardPieListHeaderIcons
        onLeadIconClick={
          leadIconKeyOverride != null ? handleLeadIconClick : undefined
        }
        leadIconAriaLabel="History calendar"
        headerTopCenter={
          <div className={styles.headerPostcardDots}>
            <PostcardIndicator />
          </div>
        }
        toolbar={hasRows ? <Toolbar section="historyList" /> : false}
        showDividerWithoutToolbar={!hasRows}
        onClose={onClose}
        closeAriaLabel="Close date list"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={clsx(styles.list, hasRows && styles.listGrid)}
          data-density-level={historyListPanelDensity}
          tabIndex={0}
          aria-label="Dispatch date list"
        >
          {hasRows ? (
            sortedEntries.map((item) => (
              <div key={item.id} className={styles.listCell}>
                <HistoryListPanelRow
                  item={item}
                  listSelectedLocalId={listSelectedLocalId}
                  onSelectEntry={onSelectEntry}
                  densityLevel={historyListPanelDensity}
                  sortEmphasis={sortEmphasis}
                />
              </div>
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconHistory className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
      <div className={clsx(styles.indicators)}>
        <div className={styles.indicatorsInner}>
          <PostcardStatusLegend
            spot="historyList"
            isHistoryEmpty={legendTreatAsEmpty}
            statusCounts={legendStatusCounts}
            calendarHistoryStripLegend={calendarHistoryStripLegend}
            calendarFooterAlwaysEnabled={calendarFooterAlwaysEnabled}
            calendarCartHistoryFooter={calendarCartHistoryFooter}
          />
        </div>
      </div>
    </div>
  )
}
