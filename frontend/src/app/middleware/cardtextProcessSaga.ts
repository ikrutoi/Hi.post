import { SagaIterator } from 'redux-saga'
import {
  all,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectFontSizeStep } from '@cardtext/infrastructure/selectors'
import { setFontSizeStep } from '@cardtext/infrastructure/state'
import { handleCardtextToolbarAction } from './cardtextToolbarSaga'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'

function* syncFontSizeButtonsStatus(): SagaIterator {
  const currentStep: number = yield select(selectFontSizeStep)
  const step = CARDTEXT_CONFIG.step

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'fontSizeMore',
      value: currentStep >= step ? 'disabled' : 'enabled',
    }),
  )

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'fontSizeLess',
      value: currentStep <= 1 ? 'disabled' : 'enabled',
    }),
  )
}

export function* watchFontSizeChanges(): SagaIterator {
  yield takeEvery(setFontSizeStep.type, syncFontSizeButtonsStatus)
}

export function* cardtextProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleCardtextToolbarAction),

    fork(watchFontSizeChanges),
  ])
}
