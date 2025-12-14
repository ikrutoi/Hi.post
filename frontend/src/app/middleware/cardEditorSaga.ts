import { takeEvery, put, select } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  recomputeEnvelope,
  clearEnvelope,
} from '@envelope/infrastructure/state'
import { selectIsDateComplete } from '@date/infrastructure/selectors'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import { selectIsEnvelopeComplete } from '@envelope/infrastructure/selectors'
import {
  setValue,
  clear as clearCardtext,
} from '@cardtext/infrastructure/state'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { updateToolbar } from '@toolbar/infrastructure/state'
import type { CardtextValue } from '@cardtext/domain/types'

function* syncDateSet() {
  const dateComplete: boolean = yield select(selectIsDateComplete)
  yield put(setSectionComplete({ section: 'date', isComplete: dateComplete }))
}

function* syncDateClear() {
  yield put(clearSection('date'))
}

function* syncAromaSet() {
  const aromaComplete: boolean = yield select(selectIsAromaComplete)
  yield put(setSectionComplete({ section: 'aroma', isComplete: aromaComplete }))
}

function* syncAromaClear() {
  yield put(clearSection('aroma'))
}

function* syncEnvelopeRecompute() {
  const envelopeComplete: boolean = yield select(selectIsEnvelopeComplete)
  yield put(
    setSectionComplete({ section: 'envelope', isComplete: envelopeComplete })
  )
}

function* syncEnvelopeClear() {
  yield put(clearSection('envelope'))
}

function* syncCardtextSet() {
  const textComplete: boolean = yield select(selectCardtextIsComplete)
  yield put(
    setSectionComplete({ section: 'cardtext', isComplete: textComplete })
  )
}

function* syncCardtextReset() {
  yield put(clearSection('cardtext'))
}

function mapCardtextValueToToolbarState(value: CardtextValue) {
  const firstBlock = value[0]
  const firstChild = firstBlock?.children[0]

  return {
    italic: firstChild?.italic ? 'active' : 'enabled',
    bold: firstChild?.bold ? 'active' : 'enabled',
    underline: firstChild?.underline ? 'active' : 'enabled',
    left: firstBlock?.align === 'left' ? 'active' : 'enabled',
    center: firstBlock?.align === 'center' ? 'active' : 'enabled',
    right: firstBlock?.align === 'right' ? 'active' : 'enabled',
    justify: firstBlock?.align === 'justify' ? 'active' : 'enabled',
  }
}

function* syncCardtextToolbar(action: ReturnType<typeof setValue>) {
  const toolbarState = mapCardtextValueToToolbarState(action.payload)
  yield put(updateToolbar({ cardtext: toolbarState }))
}

export function* cardEditorSaga() {
  yield takeEvery(setDate.type, syncDateSet)
  yield takeEvery(clearDate.type, syncDateClear)

  yield takeEvery(setAroma.type, syncAromaSet)
  yield takeEvery(clearAroma.type, syncAromaClear)

  yield takeEvery(recomputeEnvelope.type, syncEnvelopeRecompute)
  yield takeEvery(clearEnvelope.type, syncEnvelopeClear)

  yield takeEvery(setValue.type, syncCardtextSet)
  yield takeEvery(setValue.type, syncCardtextToolbar)
  yield takeEvery(clearCardtext.type, syncCardtextReset)
}
