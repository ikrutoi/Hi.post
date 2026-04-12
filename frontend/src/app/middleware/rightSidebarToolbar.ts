import { takeEvery, put, select, call } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type {
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
} from '@toolbar/domain/types'
import type { CardSection } from '@shared/config/constants'
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family'
import { RightSidebarKey } from '@/features/toolbar/domain/types/rightSidebar.types'

export function* handleRightSidebarToolbarAction(
  action: PayloadAction<{ section: string; key: RightSidebarKey }>,
) {
  const { section, key } = action.payload

  if (section === 'rightSidebar' && key === 'cart') {
    const isCartActive: boolean = yield select(selectCartListPanelOpen)
    if (isCartActive) {
      yield put(setCartListPanelOpen(false))
    } else {
      yield put(setCartListPanelOpen(true))
    }
  }
}

export function* rightSidebarToolbarSaga() {
  yield takeEvery(toolbarAction.type, handleRightSidebarToolbarAction)
}
