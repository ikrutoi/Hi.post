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
import {
  selectFontSizeStep,
  selectCardtextPlainText,
} from '@cardtext/infrastructure/selectors'
import {
  setTextStyle,
  setAlign,
  setValue,
  cardtextTemplateAdded,
  loadCardtextTemplatesRequest,
  loadCardtextTemplatesSuccess,
  loadCardtextTemplatesFailure,
  setCardtextListPanelOpen,
  setCreateDraft,
  clearCreateDraft,
  restoreCreateDraft,
  clearCreateReturnSnapshot,
  restoreCardtextSession,
  setCardtextCurrentView,
  setCardtextAddTemplateOpen,
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
import { updateToolbarIcon, updateGroupStatus } from '@toolbar/infrastructure/state'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { ImageSource } from '@cardphoto/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CardtextTemplate, TextAlign } from '@cardtext/domain/types'
import {
  selectCardtextCreateDraft,
  selectCardtextCreateReturnSnapshot,
  selectCardtextSessionData,
  selectCardtextCurrentView,
  selectCardtextAssetId,
  selectCardtextAddTemplateOpen,
} from '@cardtext/infrastructure/selectors'
import type { CardtextCreateDraft } from '@cardtext/domain/editor/types'

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

export function* syncCardtextAddButtonStatus(): SagaIterator {
  const plainText: string = yield select(selectCardtextPlainText)
  const hasText = (plainText?.trim?.() ?? '').length > 0
  const currentView: ReturnType<typeof selectCardtextCurrentView> = yield select(
    selectCardtextCurrentView,
  )
  const assetId: string | null = yield select(selectCardtextAssetId)

  const isCreateModeOpen =
    currentView === 'cardtextEditor' && (assetId == null || assetId === null)

  // cardtextAdd: disabled только когда открыт cardtextEditor в режиме создания
  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardtextAdd',
      value: isCreateModeOpen ? 'disabled' : 'enabled',
    }),
  )

  // cardtextCreate: enable "save template" only when text exists
  yield put(
    updateToolbarIcon({
      section: 'cardtextCreate',
      key: 'listAdd',
      value: hasText ? 'enabled' : 'disabled',
    }),
  )
}

export function* watchCardtextValueChanges(): SagaIterator {
  yield takeEvery([setValue.type, setTextStyle.type], syncCardtextAddButtonStatus)
}

function* syncCardtextCreateDraftIndicator(): SagaIterator {
  const draft: ReturnType<typeof selectCardtextCreateDraft> = yield select(
    selectCardtextCreateDraft,
  )
  const currentView: ReturnType<typeof selectCardtextCurrentView> = yield select(
    selectCardtextCurrentView,
  )
  const assetId: string | null = yield select(selectCardtextAssetId)
  const isCreateModeOpen =
    currentView === 'cardtextEditor' && (assetId == null || assetId === null)

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardtextAdd',
      value: {
        options: { badgeDot: !isCreateModeOpen && draft != null },
      },
    }),
  )
}

function* maybePersistCreateDraftOnExitView(
  action: ReturnType<typeof setCardtextCurrentView>,
): SagaIterator {
  const nextView = action.payload
  if (nextView !== 'cardtextView') return

  const isSaveTemplateOpen: boolean = yield select(selectCardtextAddTemplateOpen)
  // Если сейчас открыт inline-сейв шаблона — это "осознанное действие", черновик не пишем.
  if (isSaveTemplateOpen) return

  const session: ReturnType<typeof selectCardtextSessionData> = yield select(
    selectCardtextSessionData,
  )
  const assetId = session.assetId
  // Черновик нужен только для режима создания (assetId == null).
  if (assetId != null) return

  const plainText = session.plainText ?? ''
  const hasText = plainText.trim().length > 0
  if (!hasText) {
    yield put(clearCreateDraft())
    return
  }

  const draft: CardtextCreateDraft = {
    value: session.value ?? [],
    style: session.style,
    plainText: session.plainText,
    cardtextLines: session.cardtextLines,
  }
  yield put(setCreateDraft(draft))

  // Если мы заходили в create из выбранного шаблона — возвращаем отображение назад.
  const returnSnapshot: ReturnType<typeof selectCardtextCreateReturnSnapshot> =
    yield select(selectCardtextCreateReturnSnapshot)
  if (returnSnapshot != null) {
    yield put(restoreCardtextSession(returnSnapshot))
    yield put(clearCreateReturnSnapshot())
  }
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
  yield call(syncCardtextAddButtonStatus)
  yield call(syncCardtextCreateDraftIndicator)

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
    fork(watchCardtextValueChanges),
    fork(watchCardphotoOrientation),
    takeEvery(
      [setCreateDraft.type, clearCreateDraft.type, restoreCreateDraft.type],
      syncCardtextCreateDraftIndicator,
    ),
    takeEvery(
      [setCreateDraft.type, clearCreateDraft.type, restoreCreateDraft.type],
      syncCardtextAddButtonStatus,
    ),
    takeEvery(
      setCardtextCurrentView.type,
      function* (
        action: ReturnType<typeof setCardtextCurrentView>,
      ): SagaIterator {
        yield* maybePersistCreateDraftOnExitView(action)
        yield* syncCardtextCreateDraftIndicator()
      },
    ),
    takeEvery(
      setCardtextAddTemplateOpen.type,
      function* (
        action: ReturnType<typeof setCardtextAddTemplateOpen>,
      ): SagaIterator {
        const isOpen = action.payload
        // Скрываем/выключаем группу шрифта и в режиме создания, и в редакторе,
        // пока открыта полоса сохранения шаблона.
        for (const section of ['cardtextCreate', 'cardtextEditor'] as const) {
          yield put(
            updateGroupStatus({
              section,
              groupName: 'font',
              status: isOpen ? 'disabled' : 'enabled',
            }),
          )
        }
      },
    ),
  ])
}
