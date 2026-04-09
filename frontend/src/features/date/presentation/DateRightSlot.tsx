import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { pickDispatchDate, setSelectedDates } from '@date/infrastructure/state'
import { removeItem } from '@cart/infrastructure/state'
import { selectIsDateListPanelOpen } from '@date/calendar/infrastructure/selectors'
import {
  selectCachedMultiDates,
  selectCachedSingleDate,
  selectIsMultiDateMode,
  selectSelectedDate,
  selectSelectedDates,
} from '@date/infrastructure/selectors'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import {
  selectCardsByDateMap,
  selectFirstProcessedCardThumbnailUrl,
} from '@entities/card/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CalendarCardItem, CardCalendarIndex } from '@entities/card/domain/types'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { DateListPanel } from './DateListPanel'
import type { DateListPanelItem } from './DateListPanel'
import styles from './DateRightSlot.module.scss'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const sameDispatchDate = (a: DispatchDate, b: DispatchDate) =>
  a.year === b.year && a.month === b.month && a.day === b.day

function flattenDayData(dayData: CardCalendarIndex): CalendarCardItem[] {
  const list: CalendarCardItem[] = []
  if (dayData.processed) list.push(dayData.processed)
  list.push(...dayData.cart)
  list.push(...dayData.ready)
  list.push(...dayData.sent)
  list.push(...dayData.delivered)
  list.push(...dayData.error)
  return list
}

function getLocalIdFromCardId(cardId: string): number | null {
  const parts = cardId.split('__')
  if (parts.length < 2) return null
  const localId = Number(parts[parts.length - 1])
  return Number.isFinite(localId) ? localId : null
}

export const DateRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  const dateListOpen = useAppSelector(selectIsDateListPanelOpen)
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const cachedMultiDates = useAppSelector(selectCachedMultiDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  const cachedSingleDate = useAppSelector(selectCachedSingleDate)
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
  const { previewUrl: cardphotoPreviewUrl } = useAppSelector(
    selectCardphotoPreview,
  )
  const processedThumbFallback = useAppSelector(
    selectFirstProcessedCardThumbnailUrl,
  )
  const listPreviewUrl = cardphotoPreviewUrl ?? processedThumbFallback ?? null

  const handleDeleteCartPostcard = useCallback(
    async (cardId: string) => {
      const localId = getLocalIdFromCardId(cardId)
      if (localId == null) return

      await postcardsAdapter.deleteById(localId)
      dispatch(removeItem(localId))

      const allRows = await postcardsAdapter.getAll()
      const cartCount = allRows.filter((row) => row.status === 'cart').length
      const favoriteCount = allRows.filter(
        (row) => row.status === 'favorite',
      ).length

      dispatch(
        updateToolbarSection({
          section: 'rightSidebar',
          value: {
            cart: { options: { badge: cartCount > 0 ? cartCount : null } },
            favorite: { options: { badge: favoriteCount > 0 ? favoriteCount : null } },
          },
        }),
      )
    },
    [dispatch],
  )

  const dateListEntries: DateListPanelItem[] = useMemo(() => {
    if (openDayPanel) {
      return flattenDayData(openDayPanel.dayData).map((item, i) => ({
        id: `day-panel-${openDayPanel.dateKey}-${item.rowKey}-${i}`,
        cardId: item.cardId,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        detailLine: undefined,
        previewStatus: item.status,
        previewIsProcessed: item.isProcessed,
        onDelete:
          item.status === 'cart'
            ? () => {
                void handleDeleteCartPostcard(item.cardId)
              }
            : undefined,
      }))
    }

    const preview = listPreviewUrl

    const row = (
      d: DispatchDate,
      idSuffix: string,
      variant?: 'inactive',
      onDelete?: () => void,
    ): DateListPanelItem => ({
      id: `${d.year}-${d.month}-${d.day}-${idSuffix}`,
      dateLabel: formatDispatchDateLabel(d),
      previewUrl: preview,
      previewIsProcessed: true,
      variant,
      onDelete,
    })

    const entries: DateListPanelItem[] = []

    if (isMultiDateMode) {
      if (cachedSingleDate) {
        entries.push(row(cachedSingleDate, 'cached-single', 'inactive'))
      }
      selectedDates.forEach((d, i) => {
        entries.push(
          row(d, `m-${i}`, undefined, () => {
            dispatch(
              setSelectedDates(
                selectedDates.filter((x) => !sameDispatchDate(x, d)),
              ),
            )
          }),
        )
      })
    } else {
      if (selectedDate) {
        entries.push(
          row(selectedDate, 'single', undefined, () => {
            dispatch(pickDispatchDate(selectedDate))
          }),
        )
      }
      cachedMultiDates.forEach((d, i) => {
        entries.push(row(d, `cached-m-${i}`, 'inactive'))
      })
    }

    const postcardItems: CalendarCardItem[] = []
    Object.values(cardsByDateMap).forEach((day) => {
      postcardItems.push(
        ...day.cart,
        ...day.ready,
        ...day.sent,
        ...day.delivered,
        ...day.error,
      )
    })

    postcardItems.forEach((item, i) => {
      entries.push({
        id: `postcard-${item.rowKey}-${i}`,
        cardId: item.cardId,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        detailLine: undefined,
        previewStatus: item.status,
        previewIsProcessed: item.isProcessed,
        onDelete:
          item.status === 'cart'
            ? () => {
                void handleDeleteCartPostcard(item.cardId)
              }
            : undefined,
      })
    })

    return entries
  }, [
    dispatch,
    openDayPanel,
    isMultiDateMode,
    selectedDate,
    selectedDates,
    cachedSingleDate,
    cachedMultiDates,
    cardsByDateMap,
    listPreviewUrl,
    handleDeleteCartPostcard,
  ])

  const handleCloseList = useCallback(() => {
    dispatch(setDateListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  if (dateListOpen || openDayPanel) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <DateListPanel onClose={handleCloseList} entries={dateListEntries} />
        </div>
      </div>
    )
  }

  return null
}
