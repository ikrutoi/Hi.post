import { useCallback, type MouseEvent } from 'react'
import { useAppDispatch } from '@app/hooks'
import { store } from '@app/state/store'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import {
  openCardphotoFromMiniStripRequested,
  setCardphotoListPanelOpen,
} from '@cardphoto/infrastructure/state'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { setArchiveEditRetainsStrip } from '@cardPanel/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
} from '@cart/infrastructure/state'
import { isCartOwnedNotebookStrip } from '@date/calendar/application/logic/calendarStripSection'
import {
  selectIsCardPieListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import {
  closeDayPanel,
  endCartCalendarDatePick,
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { dispatchCardPieToolbarIconState } from '@toolbar/application/syncCardPieToolbarIcons'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'

export function useOpenCardphotoFactory() {
  const dispatch = useAppDispatch()
  const {
    clearRightPieCardphotoPeek,
    clearRightPieCardtextPeek,
    clearRightPieEnvelopePeek,
    clearRightPieAromaPeek,
    clearRightPieDatePeek,
  } = useRightListArchiveMini()

  return useCallback(
    (event?: MouseEvent) => {
      event?.stopPropagation()

      clearRightPieCardphotoPeek()
      clearRightPieCardtextPeek()
      clearRightPieEnvelopePeek()
      clearRightPieAromaPeek()
      clearRightPieDatePeek()

      /**
       * Пока strip «история» удерживается, sync сразу возвращает её
       * и кнопка фабрики остаётся выключенной.
       */
      dispatch(setArchiveEditRetainsStrip(null))
      dispatch(setHistoryListSelectedLocalId(null))
      dispatch(setCartListSelectedLocalId(null))
      dispatch(closeDayPanel())
      dispatch(endCartCalendarDatePick())

      const state = store.getState()
      if (selectIsCardPieListPanelOpen(state)) {
        dispatch(setCardPieListPanelOpen(false))
        dispatchCardPieToolbarIconState(dispatch, false)
      }
      if (selectCartListPanelOpen(state)) {
        dispatch(setCartListPanelOpen(false))
      }
      if (selectIsHistoryListPanelOpen(state)) {
        dispatch(setHistoryListPanelOpen(false))
      }

      const notebookStripTab = selectNotebookStripTab(state)
      if (isCartOwnedNotebookStrip(notebookStripTab)) {
        dispatch(setNotebookStripDateOverCart(true))
        dispatch(setNotebookStripTab('date'))
      } else if (notebookStripTab === 'history') {
        dispatch(setNotebookStripDateOverHistory(true))
        dispatch(setNotebookStripTab('date'))
      }

      if (selectIsMobileLayout(state)) {
        dispatch(setCardphotoListPanelOpen(false))
        dispatch(
          updateToolbarIcon({
            section: 'cardphoto',
            key: 'listCardphoto',
            value: 'enabled',
          }),
        )
      }
      dispatch(openCardphotoFromMiniStripRequested())
      dispatch(setActiveSection('cardphoto'))
    },
    [
      clearRightPieAromaPeek,
      clearRightPieCardphotoPeek,
      clearRightPieCardtextPeek,
      clearRightPieDatePeek,
      clearRightPieEnvelopePeek,
      dispatch,
    ],
  )
}
