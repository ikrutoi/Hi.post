import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  closeDayPanel,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import {
  pickDispatchDate,
  setSelectedDates,
} from '@date/infrastructure/state'
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
import type { CalendarCardItem } from '@entities/card/domain/types'
import { CardsListPanel } from '../dayPanel/CardsListPanel'
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
  const { previewUrl: cardphotoPreviewUrl } = useAppSelector(selectCardphotoPreview)
  const processedThumbFallback = useAppSelector(selectFirstProcessedCardThumbnailUrl)
  const listPreviewUrl = cardphotoPreviewUrl ?? processedThumbFallback ?? null

  const dateListEntries: DateListPanelItem[] = useMemo(() => {
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
      // Одиночная дата (до включения multi) всегда отдельной disabled-строкой, даже если ту же дату добавили в мульти.
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
      // Все запомненные мульти-даты отдельными disabled-строками, даже если совпадают с текущей одиночной.
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
      })
    })

    return entries
  }, [
    dispatch,
    isMultiDateMode,
    selectedDate,
    selectedDates,
    cachedSingleDate,
    cachedMultiDates,
    cardsByDateMap,
    listPreviewUrl,
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

  // Панель дня (CardsListPanel): шапка — дата/cards, не тулбар dateList. Имеет приоритет над списком дат.
  if (openDayPanel) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <CardsListPanel
            dateKey={openDayPanel.dateKey}
            dayData={openDayPanel.dayData}
            onClose={() => dispatch(closeDayPanel())}
          />
        </div>
      </div>
    )
  }

  if (dateListOpen) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <DateListPanel
            onClose={handleCloseList}
            entries={dateListEntries}
          />
        </div>
      </div>
    )
  }

  return null
}
