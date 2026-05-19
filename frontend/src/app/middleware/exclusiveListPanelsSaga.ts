import { SagaIterator } from 'redux-saga'
import { all, put, select, takeEvery } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import {
  setDateListPanelOpen,
  setCardPieListPanelOpen,
  setHistoryListPanelOpen,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import {
  selectIsDateListPanelOpen,
  selectIsHistoryListPanelOpen,
  selectIsCardPieListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { setCardphotoListPanelOpen } from '@cardphoto/infrastructure/state'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import {
  closeAddressList,
  setActiveAddressList,
} from '@envelope/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'

function* syncListPanelToolbarIcons(): SagaIterator {
  const dateOpen: boolean = yield select(selectIsDateListPanelOpen)
  yield put(
    updateToolbarIcon({
      section: 'date',
      key: 'listDate',
      value: dateOpen ? 'active' : 'enabled',
    }),
  )

  const historyOpen: boolean = yield select(selectIsHistoryListPanelOpen)
  yield put(
    updateToolbarIcon({
      section: 'history',
      key: 'listHistory',
      value: historyOpen ? 'active' : 'enabled',
    }),
  )

  const cartListOpen: boolean = yield select(selectCartListPanelOpen)
  const notebookStripTab = yield select(selectNotebookStripTab)
  /** Закладка «Дата» на календаре: иконка корзины в сайдбаре без active, даже если список открыт. */
  const cartSidebarHighlightActive =
    cartListOpen && notebookStripTab !== 'date'
  yield put(
    updateToolbarIcon({
      section: 'rightSidebar',
      key: 'cart',
      value: cartSidebarHighlightActive ? 'active' : 'enabled',
    }),
  )

  const cardPieOpen: boolean = yield select(selectIsCardPieListPanelOpen)
  yield put(
    updateToolbarIcon({
      section: 'editorPie',
      key: 'cardPie',
      value: cardPieOpen ? 'active' : 'enabled',
    }),
  )
  yield put(
    updateToolbarIcon({
      section: 'date',
      key: 'cardPie',
      value: cardPieOpen ? 'active' : 'enabled',
    }),
  )

  const cardphotoOpen: boolean = yield select(selectIsListPanelOpen)
  const listCardphoto: unknown = yield select(
    (s: RootState) => s.toolbar.cardphoto?.listCardphoto,
  )
  const cardphotoOpts =
    listCardphoto && typeof listCardphoto === 'object'
      ? ((listCardphoto as { options?: object }).options ?? {})
      : {}
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'listCardphoto',
      value: {
        state: cardphotoOpen ? 'active' : 'enabled',
        options: cardphotoOpts,
      },
    }),
  )

  const cardtextOpen: boolean = yield select(
    (s: RootState) => s.cardtext?.isListPanelOpen === true,
  )
  const listCardtext: unknown = yield select(
    (s: RootState) => s.toolbar.cardtext?.listCardtext,
  )
  const cardtextOpts =
    listCardtext && typeof listCardtext === 'object'
      ? ((listCardtext as { options?: object }).options ?? {})
      : {}
  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'listCardtext',
      value: {
        state: cardtextOpen ? 'active' : 'enabled',
        options: cardtextOpts,
      },
    }),
  )
}

function* closeOtherListPanels(action: {
  type: string
  payload: boolean | 'sender' | 'recipients' | null
}): SagaIterator {
  const openingDate =
    action.type === setDateListPanelOpen.type && action.payload === true
  const openingHistory =
    action.type === setHistoryListPanelOpen.type && action.payload === true
  const openingCart =
    action.type === setCartListPanelOpen.type && action.payload === true
  const openingCardPie =
    action.type === setCardPieListPanelOpen.type && action.payload === true
  const openingCardphoto =
    action.type === setCardphotoListPanelOpen.type && action.payload === true
  const openingCardtext =
    action.type === setCardtextListPanelOpen.type && action.payload === true
  const openingAddressList =
    action.type === setActiveAddressList.type && action.payload != null

  if (
    action.type === setCartListPanelOpen.type &&
    action.payload === false
  ) {
    yield* syncListPanelToolbarIcons()
  }

  if (
    !openingDate &&
    !openingHistory &&
    !openingCardPie &&
    !openingCardphoto &&
    !openingCardtext &&
    !openingAddressList &&
    !openingCart
  ) {
    return
  }

  /** Date list и cardphoto list не гасим друг друга — у каждой секции своё «запомненное» открытие. */
  if (!openingDate && !openingCardphoto) {
    yield put(setDateListPanelOpen(false))
  }
  /**
   * Списки слева (cardphoto, cardtext, адресная книга) не закрывают панель истории справа.
   * Историю гасим при открытии даты / CardPie / корзины и т.п., но не при открытии этих списков.
   */
  if (
    !openingHistory &&
    !openingCardPie &&
    !openingDate &&
    !openingCardphoto &&
    !openingCardtext &&
    !openingAddressList
  ) {
    yield put(setHistoryListPanelOpen(false))
  }
  /** Правые списки не закрываем из тулбаров sectionEditorMenu/date. */
  /**
   * Открытие корзины (правый сайдбар) не закрывает левые списки:
   * cardpie, cardphoto, cardtext, адреса — они остаются как были.
   */
  if (!openingCardPie && !openingCart && !openingHistory) {
    yield put(setCardPieListPanelOpen(false))
  }

  /**
   * Списки секций редактора (cardphoto, cardtext, адресная книга) запоминают
   * open/closed отдельно: при переключении секции панель скрывается в UI,
   * но флаг в slice не сбрасываем.
   */
  const openingEditorSectionList =
    openingCardphoto || openingCardtext || openingAddressList

  if (
    !openingCardphoto &&
    !openingDate &&
    !openingCart &&
    !openingEditorSectionList
  ) {
    yield put(setCardphotoListPanelOpen(false))
  }
  if (
    !openingCardtext &&
    !openingCart &&
    !openingEditorSectionList
  ) {
    yield put(setCardtextListPanelOpen(false))
  }

  if (!openingAddressList && !openingCart && !openingEditorSectionList) {
    yield put(closeAddressList())
  }

  yield* syncListPanelToolbarIcons()
}

function* syncListPanelToolbarIconsOnNotebookStripTab(): SagaIterator {
  yield* syncListPanelToolbarIcons()
}

export function* watchExclusiveListPanels(): SagaIterator {
  yield all([
    takeEvery(setDateListPanelOpen.type, closeOtherListPanels),
    takeEvery(setHistoryListPanelOpen.type, closeOtherListPanels),
    takeEvery(setCartListPanelOpen.type, closeOtherListPanels),
    takeEvery(setCardPieListPanelOpen.type, closeOtherListPanels),
    takeEvery(setCardphotoListPanelOpen.type, closeOtherListPanels),
    takeEvery(setCardtextListPanelOpen.type, closeOtherListPanels),
    takeEvery(setActiveAddressList.type, closeOtherListPanels),
    takeEvery(
      setNotebookStripTab.type,
      syncListPanelToolbarIconsOnNotebookStripTab,
    ),
  ])
}
