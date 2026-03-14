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
import {
  setTextStyle,
  setAlign,
  cardtextTemplateAdded,
  loadCardtextTemplatesRequest,
  loadCardtextTemplatesSuccess,
  loadCardtextTemplatesFailure,
  setCardtextListPanelOpen,
} from '@cardtext/infrastructure/state'
import { templateService } from '@entities/templates/domain/services/templateService'
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
import type { CardtextTemplate, TextAlign } from '@cardtext/domain/types'

function* syncCardtextAlignIcons(
  action: { payload: TextAlign },
): SagaIterator {
  const align = action.payload
  const alignKeys = ['left', 'center', 'right', 'justify'] as const
  for (const section of ['cardtext', 'cardtextView'] as const) {
    for (const key of alignKeys) {
      yield put(
        updateToolbarIcon({
          section,
          key,
          value: key === align ? 'active' : 'enabled',
        }),
      )
    }
  }
}

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
  yield takeEvery(setTextStyle.type, syncFontSizeButtonsStatus)
}

export function* syncCardOrientationStatus(): SagaIterator {
  const cardphotoSource: ImageSource = yield select(selectActiveSource)
  const cardOrientation: LayoutOrientation = yield select(selectCardOrientation)
  const sectionEditorMenu: SectionEditorMenuKey = yield select(
    selectToolbarSectionState('sectionEditorMenu'),
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

function* loadCardtextTemplatesSaga(): SagaIterator {
  try {
    const templates: Awaited<ReturnType<typeof templateService.getCardtextTemplates>> =
      yield call([templateService, 'getCardtextTemplates'])
    yield put(loadCardtextTemplatesSuccess(templates as CardtextTemplate[]))
  } catch {
    yield put(loadCardtextTemplatesFailure())
  }
}

export function* cardtextProcessSaga(): SagaIterator {
  yield call(syncFontSizeButtonsStatus)

  yield all([
    takeLatest(toolbarAction.type, handleCardtextToolbarAction),
    takeEvery(setAlign.type, syncCardtextAlignIcons),
    takeEvery(loadCardtextTemplatesRequest.type, loadCardtextTemplatesSaga),
    takeEvery(cardtextTemplateAdded.type, loadCardtextTemplatesSaga),
    takeEvery(setCardtextListPanelOpen.type, function* (
      action: ReturnType<typeof setCardtextListPanelOpen>,
    ) {
      if (action.payload) yield put(loadCardtextTemplatesRequest())
    }),
    fork(watchFontSizeChanges),
    fork(watchCardphotoOrientation),
  ])
}
