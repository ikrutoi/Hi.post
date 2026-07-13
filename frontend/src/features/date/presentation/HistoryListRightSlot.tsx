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
import { computeHistoryLegendStatusCounts } from '@date/application/helpers/legendStatusCounts'
import { buildHistoryListPanelEntries } from '@date/application/helpers/historyListPanelEntries'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import { selectRecipientEntriesState } from '@envelope/recipient/infrastructure/selectors'
import { HistoryListPanel, type HistoryListPanelItem } from './HistoryListPanel'
import { useCalendarFacade } from '@date/calendar/application/facades/useCalendarFacade'
import {
  selectHistoryListSelectedLocalId,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import type { IconKey } from '@shared/config/constants'

/** Список истории открыток в правой колонке (рядом с корзиной), не в левом слоте даты. */
export type HistoryListRightSlotProps = {
  onSelectEntry?: (item: HistoryListPanelItem) => void
  leadIconKeyOverride?: IconKey
  hideListHeaderChrome?: boolean
  /** Mobile factory: toolbars live in shell, not in panel header. */
  factoryChrome?: boolean
}

export const HistoryListRightSlot: React.FC<HistoryListRightSlotProps> = ({
  onSelectEntry: onSelectEntryProp,
  leadIconKeyOverride,
  hideListHeaderChrome = false,
  factoryChrome = false,
}) => {
  const dispatch = useAppDispatch()
  const { historyListPanelOpen } = useCalendarFacade()
  const cardsByDateMap = useAppSelector(selectCardsByDateMap)
  const cartItems = useAppSelector(selectCartItems)
  const recipientState = useAppSelector(selectRecipientState)
  const envelopeRecipients = useAppSelector(selectRecipientsList)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const postcardStatuses = useAppSelector(selectPostcardStatuses)
  const historyListSelectedLocalId = useAppSelector(
    selectHistoryListSelectedLocalId,
  )
  const { historyListEntries, historyUnderlyingPostcardCount, legendStatusCounts } =
    useMemo(() => {
      const { legendStatusCounts } = computeHistoryLegendStatusCounts(cartItems)
      let historyUnderlyingPostcardCount = 0
      Object.values(cardsByDateMap).forEach((day) => {
        historyUnderlyingPostcardCount +=
          day.cart.length +
          day.ready.length +
          day.sent.length +
          day.delivered.length +
          day.error.length
      })
      const historyListEntries = buildHistoryListPanelEntries({
        cardsByDateMap,
        cartItems,
        postcardStatuses,
        recipientEntries,
        envelopeRecipients,
        recipientState,
      })
      return {
        historyListEntries,
        historyUnderlyingPostcardCount,
        legendStatusCounts,
      }
    }, [
      cardsByDateMap,
      cartItems,
      postcardStatuses,
      recipientEntries,
      envelopeRecipients,
      recipientState,
    ])


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
      hideListHeaderChrome={hideListHeaderChrome}
      factoryChrome={factoryChrome}
    />
  )
}
