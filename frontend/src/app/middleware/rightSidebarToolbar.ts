import { takeEvery, put, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import type { RightSidebarKey } from '@/features/toolbar/domain/types/rightSidebar.types'

export function* handleRightSidebarToolbarAction(
  action: PayloadAction<{ section: string; key: RightSidebarKey }>,
) {
  const { section, key } = action.payload

  if (section !== 'rightSidebar') return

  if (key === 'cart') {
    const isCartActive: boolean = yield select(selectCartListPanelOpen)
    if (isCartActive) {
      yield put(setCartListPanelOpen(false))
    } else {
      yield put(setCartListPanelOpen(true))
    }
    return
  }

  if (key === 'history') {
    yield put(setActiveSection('history'))
  }
}

export function* rightSidebarToolbarSaga() {
  yield takeEvery(toolbarAction.type, handleRightSidebarToolbarAction)
}
