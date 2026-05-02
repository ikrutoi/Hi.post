import { takeEvery, put, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  RIGHT_SIDEBAR_KEYS,
  type RightSidebarKey,
} from '@/features/toolbar/domain/types/rightSidebar.types'

function* syncRightSidebarVisuals(clickedKey: RightSidebarKey) {
  const section = 'rightSidebar'
  for (const iconKey of RIGHT_SIDEBAR_KEYS) {
    yield put(
      updateToolbarIcon({
        section,
        key: iconKey,
        value: iconKey === clickedKey ? 'active' : 'enabled',
      }),
    )
  }

}

export function* handleRightSidebarToolbarAction(
  action: PayloadAction<{ section: string; key: RightSidebarKey }>,
) {
  const { section, key } = action.payload

  if (section !== 'rightSidebar') return

  if (key === 'cart') {
    const isCartActive: boolean = yield select(selectCartListPanelOpen)
    const nextOpen = !isCartActive
    yield put(setCartListPanelOpen(nextOpen))
    yield put(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    if (nextOpen) {
      for (const iconKey of RIGHT_SIDEBAR_KEYS) {
        if (iconKey === 'cart') continue
        yield put(
          updateToolbarIcon({
            section: 'rightSidebar',
            key: iconKey,
            value: 'enabled',
          }),
        )
      }
    }
    return
  }

  yield* syncRightSidebarVisuals(key)

  if (key === 'history') {
    const cartListOpen: boolean = yield select(selectCartListPanelOpen)
    if (cartListOpen) {
      yield put(setCartListPanelOpen(false))
    }
    yield put(setActiveSection('history'))
  }
}

export function* rightSidebarToolbarSaga() {
  yield takeEvery(toolbarAction.type, handleRightSidebarToolbarAction)
}
