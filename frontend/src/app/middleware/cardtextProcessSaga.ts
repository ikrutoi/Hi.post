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
  setDraftData,
  clearDraftData,
  restoreDraftData,
  restoreCardtextEditorSession,
  restoreCardtextSession,
  setStatus,
  setCardtextAddTemplateOpen,
  setCardtextDraftEngaged,
  resetCardtextAssetToEmptyDraft,
} from '@cardtext/infrastructure/state'
import { templateService } from '@entities/templates/domain/services/templateService'
import type { RootState } from '@app/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { handleCardtextToolbarAction } from './cardtextToolbarSaga'
import {
  updateToolbarIcon,
  updateGroupStatus,
} from '@toolbar/infrastructure/state'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'
import type { CardtextContent, TextAlign } from '@cardtext/domain/types'
import {
  selectCardtextDraftData,
  selectCardtextSessionData,
  selectCardtextSource,
  selectCardtextId,
  selectCardtextAddTemplateOpen,
} from '@cardtext/infrastructure/selectors'
import { isCardtextDraftContentEmpty } from '@cardtext/domain/helpers/isCardtextDraftContentEmpty'

function* syncCardtextAlignIcons(
  action: ReturnType<typeof setAlign>,
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
  const source: ReturnType<typeof selectCardtextSource> =
    yield select(selectCardtextSource)
  const templateId: string | null = yield select(selectCardtextId)
  const isDraftEngaged: boolean = yield select(
    (s: RootState) => s.cardtext.isCardtextDraftEngaged === true,
  )
  const hasAssetSession: boolean = yield select(
    (s: RootState) => s.cardtext.assetData != null,
  )

  const isCreateModeOpen =
    source === 'draft' &&
    (templateId == null || templateId === null)

  const createEditorOpenForTyping =
    isCreateModeOpen &&
    (hasText || isDraftEngaged || hasAssetSession)

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardtextAdd',
      value: createEditorOpenForTyping ? 'disabled' : 'enabled',
    }),
  )

  yield put(
    updateToolbarIcon({
      section: 'cardtextCreate',
      key: 'listAdd',
      value: hasText ? 'enabled' : 'disabled',
    }),
  )
}

export function* watchCardtextValueChanges(): SagaIterator {
  yield takeEvery(
    [setValue.type, setTextStyle.type],
    syncCardtextAddButtonStatus,
  )
}

function* syncCardtextCreateDraftIndicator(): SagaIterator {
  const source: ReturnType<typeof selectCardtextSource> =
    yield select(selectCardtextSource)
  const templateId: string | null = yield select(selectCardtextId)
  const isCreateModeOpen =
    source === 'draft' &&
    (templateId == null || templateId === null)
  const assetNull: boolean = yield select(
    (s: RootState) => s.cardtext.assetData == null,
  )
  const draftInRedux: ReturnType<typeof selectCardtextDraftData> =
    yield select(selectCardtextDraftData)
  const hasReduxDraft =
    draftInRedux != null && !isCardtextDraftContentEmpty(draftInRedux)

  const current: any = yield select(
    (state: any) => state.toolbar.cardtext?.cardtextAdd,
  )
  const currentOptions =
    current && typeof current === 'object' ? current.options ?? {} : {}
  const hasProcessed: boolean = yield call(
    [templateService, 'hasCardtextTemplateByStatus'],
    'processed',
  )
  const hasDraft: boolean = yield call(
    [templateService, 'hasCardtextTemplateByStatus'],
    'draft',
  )
  /** Dot when a draft exists (DB or Redux) and we are not “in editor” with materialized asset. */
  const shouldShowDraftDot =
    !hasProcessed &&
    (hasDraft || hasReduxDraft) &&
    (!isCreateModeOpen || assetNull)

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardtextAdd',
      value: {
        options: {
          ...currentOptions,
          badgeDot: shouldShowDraftDot,
        },
      },
    }),
  )
}

function* syncDraftRecordWithDb(): SagaIterator {
  const draft: ReturnType<typeof selectCardtextDraftData> = yield select(
    selectCardtextDraftData,
  )
  const hasText = ((draft?.plainText ?? '').trim?.() ?? '').length > 0
  if (!hasText || draft == null) {
    yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
    return
  }
  yield call([templateService, 'upsertSingleCardtextByStatus'], 'draft', {
    value: draft.value ?? [],
    style: draft.style,
    plainText: draft.plainText ?? '',
    cardtextLines: draft.cardtextLines ?? 0,
    title: '',
    favorite: null,
    status: 'draft',
  })
}

function* syncCardtextProcessedBadge(): SagaIterator {
  const hasProcessed: boolean = yield call(
    [templateService, 'hasProcessedCardtextTemplate'],
  )
  const current: any = yield select(
    (state: any) => state.toolbar.cardtext?.cardtextAdd,
  )
  const currentOptions =
    current && typeof current === 'object' ? current.options ?? {} : {}
  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardtextAdd',
      value: {
        options: { ...currentOptions, badge: hasProcessed ? 1 : null },
      },
    }),
  )
}

function* syncCardtextListBadge(): SagaIterator {
  const templates = (yield select(
    (state: any) => state.cardtext?.templatesList,
  )) as Array<unknown> | null
  // Keep previous badge while list is still unknown (null).
  if (templates == null) return
  const count = templates.length
  const current: any = yield select(
    (state: any) => state.toolbar.cardtext?.listCardtext,
  )
  const currentOptions =
    current && typeof current === 'object' ? current.options ?? {} : {}
  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'listCardtext',
      value: {
        options: { ...currentOptions, badge: count > 0 ? count : null },
      },
    }),
  )
}

function* syncCardtextListToggleIcon(): SagaIterator {
  const isOpen = (yield select(
    (state: any) => state.cardtext?.isListPanelOpen === true,
  )) as boolean
  const current: any = yield select(
    (state: any) => state.toolbar.cardtext?.listCardtext,
  )
  const currentOptions =
    current && typeof current === 'object' ? current.options ?? {} : {}
  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'listCardtext',
      value: {
        state: isOpen ? 'active' : 'enabled',
        options: currentOptions,
      },
    }),
  )
}

function* maybePersistCreateDraftOnExitView(
  action: ReturnType<typeof setStatus>,
): SagaIterator {
  const nextStatus = action.payload
  if (nextStatus === 'draft') return

  const isSaveTemplateOpen: boolean = yield select(
    selectCardtextAddTemplateOpen,
  )
  // Если сейчас открыт inline-сейв шаблона — это "осознанное действие", черновик не пишем.
  if (isSaveTemplateOpen) return

  const session: ReturnType<typeof selectCardtextSessionData> = yield select(
    selectCardtextSessionData,
  )
  const templateId =
    session.id ?? (session as { assetId?: string | null }).assetId ?? null
  // Черновик нужен только для режима создания (шаблон не выбран).
  if (templateId != null) return

  const plainText = session.plainText ?? ''
  const hasText = plainText.trim().length > 0
  if (!hasText) {
    yield put(clearDraftData())
    return
  }

  const draft: CardtextContent = {
    id: null,
    status: 'draft',
    value: session.value ?? [],
    style: session.style,
    title: session.title ?? '',
    plainText: session.plainText,
    cardtextLines: session.cardtextLines,
    favorite: session.favorite ?? null,
    timestamp: session.timestamp,
  }
  yield put(setDraftData(draft))

  // If we entered create from a selected preset, restore that preset back into view.
  const presetData = (yield select(
    (s) => (s.cardtext as { presetData?: CardtextContent | null }).presetData,
  )) as CardtextContent | null
  if (presetData != null) {
    yield put(restoreCardtextSession(presetData))
  }
}

function* loadCardtextTemplatesSaga(): SagaIterator {
  try {
    const templates: Awaited<
      ReturnType<typeof templateService.getCardtextTemplates>
    > = yield call([templateService, 'getCardtextTemplates'])
    yield put(loadCardtextTemplatesSuccess(templates))
  } catch {
    yield put(loadCardtextTemplatesFailure())
  }
}

export function* cardtextProcessSaga(): SagaIterator {
  yield call(syncFontSizeButtonsStatus)
  yield call(syncCardtextAddButtonStatus)
  yield call(syncCardtextCreateDraftIndicator)
  yield call(syncCardtextProcessedBadge)
  yield call(syncCardtextListBadge)
  yield call(syncCardtextListToggleIcon)

  yield all([
    takeLatest(toolbarAction.type, function* toolbarActionWithDependentBadges(
      action: ReturnType<typeof toolbarAction>,
    ): SagaIterator {
      // Сначала полностью обрабатываем действие (в т.ч. IndexedDB), и только
      // потом пересчитываем бэджи — иначе apply (processed→outLine) успевает
      // прочитать БД до commit и бэдж «1» залипает.
      yield call(handleCardtextToolbarAction, action)
      const { key, section } = action.payload
      if (
        key === 'cardtextCheck' ||
        key === 'apply' ||
        (key === 'delete' &&
          (section === 'cardtextView' || section === 'cardtextProcessed'))
      ) {
        yield call(syncCardtextProcessedBadge)
        yield call(syncCardtextCreateDraftIndicator)
      }
    }),
    takeEvery(setAlign.type, syncCardtextAlignIcons),
    takeEvery(loadCardtextTemplatesRequest.type, loadCardtextTemplatesSaga),
    takeEvery(loadCardtextTemplatesSuccess.type, syncCardtextListBadge),
    takeEvery(cardtextTemplateAdded.type, function* (): SagaIterator {
      yield call(loadCardtextTemplatesSaga)
      yield call(syncCardtextProcessedBadge)
      yield call(syncCardtextCreateDraftIndicator)
    }),
    takeEvery(
      setCardtextListPanelOpen.type,
      function* (action: ReturnType<typeof setCardtextListPanelOpen>) {
        yield call(syncCardtextListToggleIcon)
        if (action.payload) yield put(loadCardtextTemplatesRequest())
      },
    ),
    fork(watchFontSizeChanges),
    fork(watchCardtextValueChanges),
    takeEvery(
      [
        setCardtextDraftEngaged.type,
        resetCardtextAssetToEmptyDraft.type,
        restoreCardtextSession.type,
      ],
      function* (): SagaIterator {
        yield call(syncCardtextAddButtonStatus)
        yield call(syncCardtextCreateDraftIndicator)
      },
    ),
    takeEvery(
      [
        setDraftData.type,
        clearDraftData.type,
        restoreDraftData.type,
        restoreCardtextEditorSession.type,
      ],
      function* (): SagaIterator {
        yield call(syncDraftRecordWithDb)
        yield call(syncCardtextCreateDraftIndicator)
        yield call(syncCardtextAddButtonStatus)
      },
    ),
    takeEvery(
      setStatus.type,
      function* (
        action: ReturnType<typeof setStatus>,
      ): SagaIterator {
        yield call(maybePersistCreateDraftOnExitView, action)
        if (action.payload === 'processed') {
          // Re-check DB after successful commit flow to avoid race with toolbarAction.
          yield call(syncCardtextProcessedBadge)
        }
        yield call(syncCardtextCreateDraftIndicator)
        yield call(syncCardtextAddButtonStatus)
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
