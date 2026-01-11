import { takeEvery, put, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type { ToolbarState } from '@toolbar/domain/types'
import type { CardSection } from '@shared/config/constants'

function* handleSectionEditorMenuToolbarAction(
  action: PayloadAction<{ section: string; key: string }>
) {
  const { section, key } = action.payload

  if (section === 'sectionEditorMenu') {
    yield put(setActiveSection(key as CardSection))

    const currentState: ToolbarState['sectionEditorMenu'] = yield select(
      selectToolbarSectionState('sectionEditorMenu')
    )

    const updatedIcons = Object.fromEntries(
      Object.keys(currentState)
        .filter((k) => k !== 'config')
        .map((iconKey) => [iconKey, iconKey === key ? 'active' : 'enabled'])
    )

    const newState = {
      ...updatedIcons,
      config: currentState.config,
    }

    yield put(
      updateToolbarSection({ section: 'sectionEditorMenu', value: newState })
    )
  }
}

export function* sectionEditorMenuSaga() {
  yield takeEvery(toolbarAction.type, handleSectionEditorMenuToolbarAction)
}
