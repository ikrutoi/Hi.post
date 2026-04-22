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
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  formatRecipientDetailFromLayers,
  formatRecipientLine,
  hasCommittedSessionRecipient,
} from '@date/application/helpers/formatRecipientPlanDetailLine'
import { DateListPanel, type DateListPanelItem } from './DateListPanel'
import { HistoryListPanel, type HistoryListPanelItem } from './HistoryListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
import { selectPostcardStatuses } from '@date/calendar/infrastructure/selectors'
import styles from './DateRightSlot.module.scss'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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
  const envelopeRecipients = useAppSelector(selectRecipientsList)
  const recipientEntries = useAppSelector(
    (s) => s.addressBook?.recipientEntries ?? [],
  )
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
  const postcardByCardId = useMemo(
    () => new Map(cartItems.map((p) => [p.card.id, p] as const)),
    [cartItems],
  )

  const sessionRecipientDetail = useMemo(() => {
    if (!hasCommittedSessionRecipient(recipientState)) return undefined
    const cartDraft = cartItems.find((p) => p.status === 'cart')
    const fromPostcard = formatRecipientLine(
      cartDraft,
      recipientEntries,
      envelopeRecipients,
    )
    if (fromPostcard) return fromPostcard
    return formatRecipientDetailFromLayers(
      recipientState,
      recipientEntries,
      envelopeRecipients,
    )
  }, [cartItems, recipientState, recipientEntries, envelopeRecipients])

  const resolveRecipientDetailLine = useCallback(
    (cardId: string): string | undefined => {
      if (cardId === 'current_session') {
        return hasCommittedSessionRecipient(recipientState)
          ? sessionRecipientDetail
          : undefined
      }
      return formatRecipientLine(
        postcardByCardId.get(cardId),
        recipientEntries,
        envelopeRecipients,
      )
    },
    [
      sessionRecipientDetail,
      postcardByCardId,
      recipientEntries,
      envelopeRecipients,
      recipientState,
    ],
  )

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
