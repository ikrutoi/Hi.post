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
import { HistoryListPieEntry } from './historyList/HistoryListPieEntry'
import clsx from 'clsx'
import type { IconKey } from '@shared/config/constants'
import type { PanelDensity2Size } from '@shared/ui/icons'
import { PostcardIndicator } from '@toolbar/presentation/PostcardIndictor'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import {
  selectHistoryListPanelDensity,
  selectHistoryListCellView,
  selectHistoryListSortMode,
} from '@date/calendar/infrastructure/selectors'
import {
  getHistoryListSortEmphasis,
  sortHistoryListEntries,
  type HistoryListSortEmphasis,
} from '@date/application/helpers/historyListSort'
import { notebookTabHistoryClicked } from '@date/calendar/application/orchestration/notebookOrchestration.events'
import type { HistoryListCellView } from '@date/calendar/infrastructure/state/calendar.slice'

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
  /** Мобильный список: без иконки «Дата» и кнопки закрытия в шапке. */
  hideListHeaderChrome?: boolean
  /** Mobile factory: toolbars live in shell, not in panel header. */
  factoryChrome?: boolean
  /** Dev-only: цикл статуса открытки по localId. */
  onDebugStatusCycle?: (localId: number) => void
  // section: 'date' | 'history'
}

const HistoryListPanelRow: React.FC<{
  item: HistoryListPanelItem
  listSelectedLocalId?: number | null
  onSelectEntry?: (item: HistoryListPanelItem) => void
  onDebugStatusCycle?: (localId: number) => void
  densityLevel: PanelDensity2Size
  sortEmphasis?: HistoryListSortEmphasis
  cellView: HistoryListCellView
}> = ({
  item,
  listSelectedLocalId,
  onSelectEntry,
  onDebugStatusCycle,
  densityLevel,
  sortEmphasis,
  cellView,
}) => {
  const { displayUrl, onPreviewImgError } = useListCardPreviewUrl(
    item.cardId,
    item.previewUrl,
    {
      previewIsProcessed: item.previewAllowBlob ?? item.previewIsProcessed,
    },
  )

  const sharedProps = {
    dateLabel: item.dateLabel,
    detailLine: item.detailLine,
    variant: item.variant,
    previewStatus: item.previewStatus,
    previewIsProcessed: item.previewIsProcessed,
    onSelect:
      onSelectEntry && item.variant !== 'inactive'
        ? () => onSelectEntry(item)
        : undefined,
    isSelected:
      item.postcardLocalId != null &&
      item.postcardLocalId === listSelectedLocalId,
    densityLevel,
    sortEmphasis,
    onDebugStatusCycle:
      item.postcardLocalId != null && onDebugStatusCycle
        ? () => onDebugStatusCycle(item.postcardLocalId!)
        : undefined,
  }

  if (cellView === 'pie') {
    return (
      <HistoryListPieEntry
        postcardLocalId={item.postcardLocalId}
        dateLabel={item.dateLabel}
        detailLine={item.detailLine}
        variant={item.variant}
        previewStatus={item.previewStatus}
        previewIsProcessed={item.previewIsProcessed}
        onSelect={sharedProps.onSelect}
        isSelected={sharedProps.isSelected}
      />
    )
  }

  return (
    <HistoryListEntry
      {...sharedProps}
      previewUrl={displayUrl}
      onPreviewImgError={onPreviewImgError}
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
  hideListHeaderChrome = false,
  factoryChrome = false,
  onDebugStatusCycle,
  // section,
}) => {
  const dispatch = useAppDispatch()
  const { isMobileLayout } = useSizeFacade()
  const useFactoryChrome = factoryChrome && isMobileLayout
  const historyListPanelDensity = useAppSelector(selectHistoryListPanelDensity)
  const historyListCellView = useAppSelector(selectHistoryListCellView)
  const historyListSortMode = useAppSelector(selectHistoryListSortMode)
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
      className={clsx(
        styles.panel,
        !hasRows && styles.panelEmptyNoToolbar,
        useFactoryChrome && styles.panelFactoryChrome,
      )}
    >
      {!useFactoryChrome ? (
        <ListPanelStackedHeader
          leadIconKey={leadIconKeyOverride ?? 'listHistory'}
          cardPieListHeaderIcons
          hideLeadIcon={hideListHeaderChrome}
          hideClose={hideListHeaderChrome}
          onLeadIconClick={
            !hideListHeaderChrome && leadIconKeyOverride != null
              ? handleLeadIconClick
              : undefined
          }
          leadIconAriaLabel="History calendar"
          headerTopCenter={
            <div className={styles.headerPostcardDots}>
              <div className={styles.headerPostcardDotsChrome}>
                <PostcardIndicator interactive />
              </div>
            </div>
          }
          toolbar={hasRows ? <Toolbar section="historyList" /> : false}
          showDividerWithoutToolbar={!hasRows}
          onClose={hideListHeaderChrome ? undefined : onClose}
          closeAriaLabel="Close date list"
        />
      ) : null}
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={clsx(styles.list, hasRows && styles.listGrid)}
          data-density-level={historyListPanelDensity}
          data-cell-view={historyListCellView}
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
                  onDebugStatusCycle={onDebugStatusCycle}
                  densityLevel={historyListPanelDensity}
                  sortEmphasis={sortEmphasis}
                  cellView={historyListCellView}
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
