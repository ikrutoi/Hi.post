import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectDateListSortDirection } from '@date/calendar/infrastructure/selectors'
import { useDispatchPlanListEntries } from '../application/hooks/useDispatchPlanListEntries'
import { IconListDate } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import {
  DateListEntry,
  type DateListEntryVariant,
} from './dateList/DateListEntry'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CardPieRefs } from '@features/cardPie/domain/types'
import styles from './DateListPanel.module.scss'

export type DateListPanelItem = {
  id: string
  cardId?: string
  sourceDate?: DispatchDate
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  /** Стоимость строки для CardPie (и при необходимости других списков). */
  priceLine?: string
  variant?: DateListEntryVariant
  previewIsProcessed?: boolean
  onDelete?: () => void
  /** Ключ ветки «дата|получатель» для корзины / toggle в Card pie. */
  dispatchBranchKey?: string
  /** Ссылки на выбранные шаблоны для сохранения CardPie favorite. */
  cardPieRefs?: CardPieRefs
}

type Props = {
  onClose: () => void
  onSelectEntry?: (item: DateListPanelItem) => void
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

const DateListPanelRow: React.FC<{
  item: DateListPanelItem
  onSelectEntry?: (item: DateListPanelItem) => void
}> = ({ item, onSelectEntry }) => {
  const dispatch = useAppDispatch()
  const cachedUrl = useAppSelector(
    selectCalendarPreviewDisplayUrl(item.cardId ?? ''),
  )

  useEffect(() => {
    if (item.cardId && !cachedUrl && item.previewUrl) {
      dispatch(
        requestCalendarPreview({
          cardId: item.cardId,
          previewUrl: item.previewUrl,
        }),
      )
    }
  }, [dispatch, cachedUrl, item.cardId, item.previewUrl])

  const allowBlobFallback =
    item.cardId === 'current_session' || Boolean(item.previewIsProcessed)
  const safeFallbackUrl =
    isBlobUrl(item.previewUrl) && !allowBlobFallback ? null : item.previewUrl
  const displayUrl = cachedUrl ?? safeFallbackUrl

  return (
    <DateListEntry
      key={item.id}
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      detailLine={item.detailLine}
      variant={item.variant}
      onSelect={
        onSelectEntry && item.variant !== 'inactive'
          ? () => onSelectEntry(item)
          : undefined
      }
      onDelete={item.onDelete}
    />
  )
}

export const DateListPanel: React.FC<Props> = ({
  onClose,
  onSelectEntry,
}) => {
  const listSortDirection = useAppSelector(selectDateListSortDirection)
  const entries = useDispatchPlanListEntries({
    activeModeOnly: true,
    listSortDirection,
  })
  const hasRows = entries.length > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  return (
    <div className={styles.panel}>
      <ListPanelStackedHeader
        leadIconKey="listDate"
        toolbar={<Toolbar section="dateList" />}
        onClose={onClose}
        closeAriaLabel="Close date list"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label="Dispatch date list"
        >
          {hasRows ? (
            entries.map((item) => (
              <DateListPanelRow
                key={item.id}
                item={item}
                onSelectEntry={onSelectEntry}
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconListDate className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
      {/* {section === 'history' && hasRows && (
        <div className={styles.indicators}>
          <div className={styles.indicatorsInner}>
            <PostcardStatusLegend
              spot="dateList"
              // isHistoryMode={isHistoryMode}
            />
          </div>
        </div>
      )} */}
    </div>
  )
}
