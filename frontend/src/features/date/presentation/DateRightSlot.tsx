import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { pickDispatchDate, setSelectedDates } from '@date/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
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
import type {
  CalendarCardItem,
  CardCalendarIndex,
} from '@entities/card/domain/types'
import type { Postcard } from '@entities/postcard'
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

function formatRecipientLine(
  postcard: Postcard | undefined,
): string | undefined {
  // console.log('postcard', postcard)
  const recipient = postcard?.card?.envelope?.recipient as
    | {
        appliedData?: { name?: string; country?: string } | null
        viewDraft?: { name?: string; country?: string }
        formDraft?: { name?: string; country?: string }
      }
    | undefined

  const source =
    recipient?.appliedData ??
    recipient?.viewDraft ??
    recipient?.formDraft ??
    null
  const name = String(source?.name ?? '').trim()
  const country = String(source?.country ?? '').trim()

  if (name && country) return `${name}, ${country}`
  return name || country || undefined
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
  const cartItems = useAppSelector(selectCartItems)
  const { previewUrl: cardphotoPreviewUrl } = useAppSelector(
    selectCardphotoPreview,
  )
  const processedThumbFallback = useAppSelector(
    selectFirstProcessedCardThumbnailUrl,
  )
  const listPreviewUrl = cardphotoPreviewUrl ?? processedThumbFallback ?? null
  const postcardByCardId = useMemo(
    () =>
      new Map(
        cartItems
          .filter((p) => p.status !== 'cart')
          .map((p) => [p.card.id, p] as const),
      ),
    [cartItems],
  )

  const dateListEntries: DateListPanelItem[] = useMemo(() => {
    if (openDayPanel) {
      return flattenDayData(openDayPanel.dayData).map((item, i) => ({
        detailLine: formatRecipientLine(postcardByCardId.get(item.cardId)),
        id: `day-panel-${openDayPanel.dateKey}-${item.rowKey}-${i}`,
        cardId: item.cardId,
        sourceDate: item.date,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        previewStatus: item.status,
        previewIsProcessed: item.isProcessed,
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
      sourceDate: d,
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
        sourceDate: item.date,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        detailLine: formatRecipientLine(postcardByCardId.get(item.cardId)),
        previewStatus: item.status,
        previewIsProcessed: item.isProcessed,
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
    postcardByCardId,
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

  const handleSelectEntry = useCallback(
    (item: DateListPanelItem) => {
      if (!item.sourceDate) return
      dispatch(
        updateLastViewedCalendarDate({
          year: item.sourceDate.year,
          month: item.sourceDate.month,
        }),
      )
    },
    [dispatch],
  )

  if (dateListOpen || openDayPanel) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <DateListPanel
            onClose={handleCloseList}
            entries={dateListEntries}
            onSelectEntry={handleSelectEntry}
          />
        </div>
      </div>
    )
  }

  return null
}
