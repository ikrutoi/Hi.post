import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  updateLastViewedCalendarDate,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CalendarCardItem } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { computeHistoryLegendStatusCounts } from '@date/application/helpers/legendStatusCounts'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  formatRecipientDetailFromLayers,
  formatRecipientLine,
  hasCommittedSessionRecipient,
} from '@date/application/helpers/formatRecipientPlanDetailLine'
import { HistoryListPanel, type HistoryListPanelItem } from './HistoryListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
import {
  selectHistoryListSelectedLocalId,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import { postcardLocalIdFromCalendarCardItem } from '@date/calendar/infrastructure/postcardLocalIdFromCalendarCardItem'
import type { IconKey } from '@shared/config/constants'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Список истории открыток в правой колонке (рядом с корзиной), не в левом слоте даты. */
export type HistoryListRightSlotProps = {
  onSelectEntry?: (item: HistoryListPanelItem) => void
  leadIconKeyOverride?: IconKey
}

export const HistoryListRightSlot: React.FC<HistoryListRightSlotProps> = ({
  onSelectEntry: onSelectEntryProp,
  leadIconKeyOverride,
}) => {
  const dispatch = useAppDispatch()
  const { historyListPanelOpen } = useCalendarFacade()
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
  const cartItems = useAppSelector(selectCartItems)
  const recipientState = useAppSelector(selectRecipientState)
  const envelopeRecipients = useAppSelector(selectRecipientsList)
  const recipientEntries = useAppSelector(
    (s) => s.addressBook?.recipientEntries ?? [],
  )
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
  const historyListSelectedLocalId = useAppSelector(
    selectHistoryListSelectedLocalId,
  )
  const postcardByCardId = useMemo(
    () => new Map(cartItems.map((p) => [p.card.id, p] as const)),
    [cartItems],
  )

  const sessionRecipientDetail = useMemo(() => {
    if (!hasCommittedSessionRecipient(recipientState)) return undefined
    const cartDraft = cartItems.find(
      (p) => p.status === 'cart' || p.status === 'cartBlocked',
    )
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

  const { historyListEntries, historyUnderlyingPostcardCount, legendStatusCounts } =
    useMemo(() => {
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
      const { legendStatusCounts, historyUnderlyingPostcardCount } =
        computeHistoryLegendStatusCounts(cartItems)
      const entries: HistoryListPanelItem[] = []
      postcardItems.forEach((item, i) => {
        if (item.status === 'cartBlocked') return
        if (!postcardStatuses[item.status]) return
        entries.push({
          id: `history-postcard-${item.rowKey}-${i}`,
          cardId: item.cardId,
          postcardLocalId: postcardLocalIdFromCalendarCardItem(item, cartItems),
          sourceDate: item.date,
          dateLabel: formatDispatchDateLabel(item.date),
          previewUrl: item.previewUrl,
          detailLine: resolveRecipientDetailLine(item.cardId),
          previewStatus: item.status,
          previewIsProcessed: item.isProcessed,
          previewAllowBlob: item.previewAllowBlob,
        })
      })
      return {
        historyListEntries: entries,
        historyUnderlyingPostcardCount: postcardItems.length,
        legendStatusCounts,
      }
    }, [cardsByDateMap, cartItems, postcardStatuses, resolveRecipientDetailLine])

  const handleCloseList = useCallback(() => {
    dispatch(setHistoryListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'history',
        key: 'listHistory',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleSelectEntry = useCallback(
    (item: HistoryListPanelItem) => {
      if (onSelectEntryProp) {
        onSelectEntryProp(item)
        return
      }
      dispatch(setNotebookStripTab('history'))
      dispatch(setActiveSection('history'))
      if (item.sourceDate) {
        dispatch(
          updateLastViewedCalendarDate({
            year: item.sourceDate.year,
            month: item.sourceDate.month,
          }),
        )
      }
      const lid = item.postcardLocalId
      if (lid == null) return
      dispatch(
        setHistoryListSelectedLocalId(
          historyListSelectedLocalId === lid ? null : lid,
        ),
      )
    },
    [dispatch, historyListSelectedLocalId, onSelectEntryProp],
  )

  if (!historyListPanelOpen) return null

  return (
    <HistoryListPanel
      onClose={handleCloseList}
      entries={historyListEntries}
      listSelectedLocalId={historyListSelectedLocalId}
      onSelectEntry={handleSelectEntry}
      hasUnderlyingHistoryEntries={historyUnderlyingPostcardCount > 0}
      legendStatusCounts={legendStatusCounts}
      calendarHistoryStripLegend
      calendarFooterAlwaysEnabled
      calendarCartHistoryFooter
      leadIconKeyOverride={leadIconKeyOverride}
    />
  )
}
