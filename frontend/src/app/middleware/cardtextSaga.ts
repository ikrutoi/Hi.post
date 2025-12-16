import { put, takeLatest } from 'redux-saga/effects'
import { initCardtext, setValue } from '@cardtext/infrastructure/state'
import { buildCardtextToolbarState } from '@cardtext/domain/helpers'
import {
  initialCardtextValue,
  initialCardtextToolbarState,
} from '@cardtext/domain/types'
import { updateToolbarSection } from '@toolbar/infrastructure/state'

function* handleInitCardtext() {
  yield put(initCardtext(initialCardtextValue))

  yield put(
    updateToolbarSection({
      section: 'cardtext',
      value: initialCardtextToolbarState,
    })
  )
}

function* handleSetValue(action: ReturnType<typeof setValue>) {
  const toolbarState = buildCardtextToolbarState(action.payload)

  yield put(
    updateToolbarSection({
      section: 'cardtext',
      value: toolbarState,
    })
  )
}

export function* cardtextSaga() {
  yield takeLatest('cardtext/init', handleInitCardtext)
  yield takeLatest(setValue.type, handleSetValue)
}
