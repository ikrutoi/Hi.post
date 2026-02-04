import { SagaIterator } from 'redux-saga'
import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectFontSizeStep } from '@cardtext/infrastructure/selectors'
import { setFontSizeStep } from '@cardtext/infrastructure/state'
import {
  selectActiveSource,
  selectCardOrientation,
} from '@cardphoto/infrastructure/selectors'
import {
  setOrientation,
  setActiveSource,
} from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { handleCardtextToolbarAction } from './cardtextToolbarSaga'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { ImageSource } from '@cardphoto/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export function* syncFontSizeButtonsStatus(): SagaIterator {
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

export function* syncCardOrientationStatus(): SagaIterator {
  const cardphotoSource: ImageSource = yield select(selectActiveSource)
  const cardOrientation: LayoutOrientation = yield select(selectCardOrientation)
  const sectionEditorMenu: SectionEditorMenuKey = yield select(
    selectToolbarSectionState('sectionEditorMenu'),
  )

  // const activeSection: string = yield select(selectActiveSection)

  console.log(
    'syncCardOrientation',
    cardphotoSource,
    cardOrientation,
    sectionEditorMenu,
  )

  const isUserSource = cardphotoSource === 'user'

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardOrientation',
      value: {
        state: isUserSource ? 'enabled' : 'disabled',
        options: { orientation: cardOrientation },
      },
    }),
  )
}

export function* watchCardphotoOrientation(): SagaIterator {
  yield takeEvery(
    [setOrientation.type, setActiveSource.type, toolbarAction.type],
    syncCardOrientationStatus,
  )
}

export function* cardtextProcessSaga(): SagaIterator {
  yield call(syncFontSizeButtonsStatus)

  yield all([
    takeLatest(toolbarAction.type, handleCardtextToolbarAction),

    fork(watchFontSizeChanges),
    fork(watchCardphotoOrientation),
  ])
}
