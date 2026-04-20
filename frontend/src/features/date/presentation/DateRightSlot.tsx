import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { pickDispatchDate, setSelectedDates } from '@date/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
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
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { selectSelectedRecipientEntriesInOrder } from '@envelope/infrastructure/selectors'
import { DateListPanel } from './DateListPanel'
import { HistoryListPanel, type HistoryListPanelItem } from './HistoryListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
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

/** Name + country (or city if country empty), from envelope recipient layers. */
function formatRecipientDetailFromLayers(
  recipient: RecipientState | undefined,
): string | undefined {
  if (!recipient) return undefined
  const source =
    recipient.appliedData ??
    recipient.viewDraft ??
    recipient.formDraft ??
    null
  const name = String(source?.name ?? '').trim()
  const country = String(source?.country ?? '').trim()
  const city = String(source?.city ?? '').trim()
  const region = country || city
  if (name && region) return `${name}, ${region}`
  return name || region || undefined
}

function formatRecipientLine(postcard: Postcard | undefined): string | undefined {
  return formatRecipientDetailFromLayers(postcard?.card?.envelope?.recipient)
}

function formatDetailLineFromAddressBookEntry(
  entry: AddressBookEntry,
): string | undefined {
  const addr = entry.address
  if (!addr) return undefined
  const name = String(addr.name ?? '').trim()
  const country = String(addr.country ?? '').trim()
  const city = String(addr.city ?? '').trim()
  const region = country || city
  if (name && region) return `${name}, ${region}`
  return name || region || undefined
}

export const DateRightSlot: React.FC<{ section: 'date' | 'history' }> = ({
  section,
}) => {
  const dispatch = useAppDispatch()
  const calendarFacade = useCalendarFacade()
  const { dateListPanelOpen, historyListPanelOpen } = calendarFacade
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  // const dateListOpen = useAppSelector(selectIsDateListPanelOpen)
  const selectedDate = useAppSelector(selectSelectedDate)
  const selectedDates = useAppSelector(selectSelectedDates)
  const cachedMultiDates = useAppSelector(selectCachedMultiDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  const cachedSingleDate = useAppSelector(selectCachedSingleDate)
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
  const cartItems = useAppSelector(selectCartItems)
  const recipientState = useAppSelector(selectRecipientState)
  const selectedRecipientEntriesInOrder = useAppSelector(
    selectSelectedRecipientEntriesInOrder,
  )
  const { previewUrl: cardphotoPreviewUrl } = useAppSelector(
    selectCardphotoPreview,
  )
  const processedThumbFallback = useAppSelector(
    selectFirstProcessedCardThumbnailUrl,
  )
  const listPreviewUrl = cardphotoPreviewUrl ?? processedThumbFallback ?? null
  const postcardByCardId = useMemo(
    () => new Map(cartItems.map((p) => [p.card.id, p] as const)),
    [cartItems],
  )

  const sessionRecipientDetail = useMemo(() => {
    const cartDraft = cartItems.find((p) => p.status === 'cart')
    const fromPostcard = formatRecipientLine(cartDraft)
    if (fromPostcard) return fromPostcard
    return formatRecipientDetailFromLayers(recipientState)
  }, [cartItems, recipientState])

  const resolveRecipientDetailLine = useCallback(
    (cardId: string): string | undefined => {
      if (cardId === 'current_session') return sessionRecipientDetail
      return formatRecipientLine(postcardByCardId.get(cardId))
    },
    [sessionRecipientDetail, postcardByCardId],
  )

  /** One slot per selected address-book recipient; otherwise a single session line. */
  const recipientSlots = useMemo(() => {
    if (selectedRecipientEntriesInOrder.length > 0) {
      return selectedRecipientEntriesInOrder.map((e) => ({
        key: e.id,
        detailLine: formatDetailLineFromAddressBookEntry(e),
      }))
    }
    return [{ key: 'session', detailLine: sessionRecipientDetail }]
  }, [selectedRecipientEntriesInOrder, sessionRecipientDetail])

  const dateListEntries: DateListPanelItem[] = useMemo(() => {
    if (openDayPanel) {
      return flattenDayData(openDayPanel.dayData).map((item, i) => ({
        detailLine: resolveRecipientDetailLine(item.cardId),
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
      recipientDetailLine?: string | null,
    ): DateListPanelItem => ({
      id: `${d.year}-${d.month}-${d.day}-${idSuffix}`,
      sourceDate: d,
      dateLabel: formatDispatchDateLabel(d),
      detailLine: recipientDetailLine ?? sessionRecipientDetail ?? undefined,
      previewUrl: preview,
      previewIsProcessed: true,
      variant,
      onDelete,
    })

    const entries: DateListPanelItem[] = []

    if (isMultiDateMode) {
      if (cachedSingleDate) {
        recipientSlots.forEach((slot, ri) => {
          entries.push(
            row(
              cachedSingleDate,
              `cached-single-rcpt-${slot.key}-${ri}`,
              'inactive',
              undefined,
              slot.detailLine,
            ),
          )
        })
      }
      selectedDates.forEach((d, i) => {
        recipientSlots.forEach((slot, ri) => {
          entries.push(
            row(
              d,
              `m-${i}-rcpt-${slot.key}-${ri}`,
              undefined,
              () => {
                dispatch(
                  setSelectedDates(
                    selectedDates.filter((x) => !sameDispatchDate(x, d)),
                  ),
                )
              },
              slot.detailLine,
            ),
          )
        })
      })
    } else {
      if (selectedDate) {
        recipientSlots.forEach((slot, ri) => {
          entries.push(
            row(
              selectedDate,
              `single-rcpt-${slot.key}-${ri}`,
              undefined,
              () => {
                dispatch(pickDispatchDate(selectedDate))
              },
              slot.detailLine,
            ),
          )
        })
      }
      cachedMultiDates.forEach((d, i) => {
        recipientSlots.forEach((slot, ri) => {
          entries.push(
            row(
              d,
              `cached-m-${i}-rcpt-${slot.key}-${ri}`,
              'inactive',
              undefined,
              slot.detailLine,
            ),
          )
        })
      })
    }

    return entries
  }, [
    dispatch,
    openDayPanel,
    isMultiDateMode,
    selectedDate,
    selectedDates,
    cachedSingleDate,
    cachedMultiDates,
    sessionRecipientDetail,
    recipientSlots,
    resolveRecipientDetailLine,
    listPreviewUrl,
  ])

  const historyListEntries: HistoryListPanelItem[] = useMemo(() => {
    const entries: HistoryListPanelItem[] = []
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
        id: `history-postcard-${item.rowKey}-${i}`,
        cardId: item.cardId,
        sourceDate: item.date,
        dateLabel: formatDispatchDateLabel(item.date),
        previewUrl: item.previewUrl,
        detailLine: resolveRecipientDetailLine(item.cardId),
        previewStatus: item.status,
        previewIsProcessed: item.isProcessed,
      })
    })
    return entries
  }, [cardsByDateMap, resolveRecipientDetailLine])

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

  if (dateListPanelOpen || historyListPanelOpen) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          {section === 'date' && dateListPanelOpen && (
            <DateListPanel
              onClose={handleCloseList}
              entries={dateListEntries}
              onSelectEntry={handleSelectEntry}
            />
          )}
          {section === 'history' && historyListPanelOpen && (
            <HistoryListPanel
              onClose={handleCloseList}
              entries={historyListEntries}
              onSelectEntry={handleSelectEntry}
            />
          )}
        </div>
      </div>
    )
  }

  return null
}
