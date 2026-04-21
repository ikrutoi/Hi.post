import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CalendarCardItem } from '@entities/card/domain/types'
import type { Postcard } from '@entities/postcard'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import type { RecipientState } from '@envelope/recipient/domain/types'
import { DateListPanel, type DateListPanelItem } from './DateListPanel'
import { HistoryListPanel, type HistoryListPanelItem } from './HistoryListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
import { selectPostcardStatuses } from '@date/calendar/infrastructure/selectors'
import { useDispatchPlanListEntries } from '../application/hooks/useDispatchPlanListEntries'
import styles from './DateRightSlot.module.scss'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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

export const DateRightSlot: React.FC<{ section: 'date' | 'history' }> = ({
  section,
}) => {
  const dispatch = useAppDispatch()
  const calendarFacade = useCalendarFacade()
  const { dateListPanelOpen, historyListPanelOpen } = calendarFacade
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
  const cartItems = useAppSelector(selectCartItems)
  const recipientState = useAppSelector(selectRecipientState)
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
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

  const dateListEntries = useDispatchPlanListEntries({ activeModeOnly: false })

  const { historyListEntries, historyUnderlyingPostcardCount } = useMemo(() => {
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
    const entries: HistoryListPanelItem[] = []
    postcardItems.forEach((item, i) => {
      if (!postcardStatuses[item.status]) return
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
    return {
      historyListEntries: entries,
      historyUnderlyingPostcardCount: postcardItems.length,
    }
  }, [cardsByDateMap, postcardStatuses, resolveRecipientDetailLine])

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
              hasUnderlyingHistoryEntries={historyUnderlyingPostcardCount > 0}
            />
          )}
        </div>
      </div>
    )
  }

  return null
}
