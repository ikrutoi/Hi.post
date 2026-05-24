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
  setCardtextId,
  setCardtextAddTemplateOpen,
  setDraftEngaged,
  setCardtextViewEditMode,
  resetCardtextAssetToEmptyDraft,
  clearText,
  deleteCardtextFromViewRequested,
  openCardtextFromMiniStripRequested,
} from '@cardtext/infrastructure/state'
import { openCardtextFromMiniStripSaga } from '@cardtext/application/helpers'
import { templateService } from '@entities/templates/domain/services/templateService'
import type { RootState } from '@app/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  handleCardtextToolbarAction,
  handleDeleteCardtextFromView,
} from './cardtextToolbarSaga'
import {
  updateToolbarIcon,
  updateToolbarSection,
  updateGroupStatus,
} from '@toolbar/infrastructure/state'
import { syncFontSizeButtonsStatus } from './cardtextHandlers'
import type { CardtextContent, TextAlign } from '@cardtext/domain/types'
import {
  selectCardtextDraftData,
  selectCardtextSessionData,
  selectCardtextSource,
  selectCardtextId,
  selectCardtextAddTemplateOpen,
} from '@cardtext/infrastructure/selectors'
import { isCardtextDraftContentEmpty } from '@cardtext/domain/helpers/isCardtextDraftContentEmpty'
import { resolveCardtextAddListToolbarState } from '@cardtext/domain/helpers/cardtextQuickListMatch'
import { buildCardtextToolbarState } from '@cardtext/domain/helpers'
import {
  selectCardtextTemplatesListItems,
  selectCardtextInteractionMode,
  selectCardtextValue,
  selectCardtextAssetMatchesApplied,
} from '@cardtext/infrastructure/selectors'

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

export function* watchFontSizeChanges(): SagaIterator {
  yield takeEvery(setTextStyle.type, syncFontSizeButtonsStatus)
}

/** Apply в секции cardtext — только вне формы создания (createEmpty). */
export function* syncCardtextMainToolbarApply(): SagaIterator {
  const interactionMode: ReturnType<typeof selectCardtextInteractionMode> =
    yield select(selectCardtextInteractionMode)
  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const assetMatchesApplied: boolean = yield select(
    selectCardtextAssetMatchesApplied,
  )
  const { apply } = buildCardtextToolbarState(value, {
    assetProcessed: assetMatchesApplied,
    disableApply: interactionMode === 'createEmpty',
  })
  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'apply',
      value: apply ?? 'disabled',
    }),
  )
}

export function* syncCardtextAddButtonStatus(): SagaIterator {
  const plainText: string = yield select(selectCardtextPlainText)
  const hasText = (plainText?.trim?.() ?? '').length > 0
  const source: ReturnType<typeof selectCardtextSource> =
    yield select(selectCardtextSource)
  const templateId: string | null = yield select(selectCardtextId)
  const isDraftEngaged: boolean = yield select(
    (s: RootState) => s.cardtext.isDraftEngaged === true,
  )

  const isCreateModeOpen =
    source === 'draft' && (templateId == null || templateId === null)

  const createEditorOpenForTyping =
    isCreateModeOpen && (hasText || isDraftEngaged)

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

/** applyLight на cardtextEditor / cardtextCreate — только при непустом тексте. */
export function* syncCardtextCheckButtonStatus(): SagaIterator {
  const plainText: string = yield select(selectCardtextPlainText)
  const hasText = (plainText?.trim?.() ?? '').length > 0
  const checkState = hasText ? 'enabled' : 'disabled'
  for (const section of ['cardtextCreate', 'cardtextEditor'] as const) {
    yield put(
      updateToolbarIcon({
        section,
        key: 'applyLight',
        value: { state: checkState },
      }),
    )
  }
}

export function* watchCardtextValueChanges(): SagaIterator {
  yield takeEvery(
    [setValue.type, setTextStyle.type, clearText.type],
    function* (): SagaIterator {
      yield call(syncCardtextAddButtonStatus)
      yield call(syncCardtextCheckButtonStatus)
      yield call(syncCardtextMainToolbarApply)
      yield call(syncCardtextViewToolbarAddList)
    },
  )
}

export function* syncCardtextViewToolbarAddList(): SagaIterator {
  const source: ReturnType<typeof selectCardtextSource> =
    yield select(selectCardtextSource)
  if (source !== 'view') return

  const plainText: string = yield select(selectCardtextPlainText)
  const hasText = (plainText?.trim?.() ?? '').length > 0
  const templateId: string | null = yield select(selectCardtextId)
  const templates: ReturnType<typeof selectCardtextTemplatesListItems> =
    yield select(selectCardtextTemplatesListItems)

  yield put(
    updateToolbarSection({
      section: 'cardtextView',
      value: {
        addList: {
          state: resolveCardtextAddListToolbarState(
            hasText,
            plainText,
            templates,
            templateId,
          ),
        },
        edit: { state: 'enabled' },
        close: { state: 'enabled' },
      },
    }),
  )
}

function* syncCardtextCreateDraftIndicator(): SagaIterator {
  const source: ReturnType<typeof selectCardtextSource> =
    yield select(selectCardtextSource)
  const templateId: string | null = yield select(selectCardtextId)
  const isCreateModeOpen =
    source === 'draft' && (templateId == null || templateId === null)
  const assetNull: boolean = yield select(
    (s: RootState) => s.cardtext.assetData == null,
  )
  const draftInRedux: ReturnType<typeof selectCardtextDraftData> = yield select(
    selectCardtextDraftData,
  )
  const hasReduxDraft =
    draftInRedux != null && !isCardtextDraftContentEmpty(draftInRedux)

  const current: any = yield select(
    (state: any) => state.toolbar.cardtext?.cardtextAdd,
  )
  const currentOptions =
    current && typeof current === 'object' ? (current.options ?? {}) : {}
  const hasProcessed: boolean = yield call(
    [templateService, 'hasCardtextTemplateByStatus'],
    'processed',
  )
  const hasDraft: boolean = yield call(
    [templateService, 'hasCardtextTemplateByStatus'],
    'draft',
  )
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
  const hasProcessed: boolean = yield call([
    templateService,
    'hasProcessedCardtextTemplate',
  ])
  const current: any = yield select(
    (state: any) => state.toolbar.cardtext?.cardtextAdd,
  )
  const currentOptions =
    current && typeof current === 'object' ? (current.options ?? {}) : {}
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
    current && typeof current === 'object' ? (current.options ?? {}) : {}
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
    current && typeof current === 'object' ? (current.options ?? {}) : {}
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
  if (isSaveTemplateOpen) return

  const session: ReturnType<typeof selectCardtextSessionData> = yield select(
    selectCardtextSessionData,
  )
  const templateId =
    session.id ?? (session as { assetId?: string | null }).assetId ?? null
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
  yield call(syncCardtextCheckButtonStatus)
  yield call(syncCardtextViewToolbarAddList)
  yield call(syncCardtextCreateDraftIndicator)
  yield call(syncCardtextProcessedBadge)
  yield call(syncCardtextListBadge)
  yield call(syncCardtextListToggleIcon)

  yield all([
    takeLatest(
      toolbarAction.type,
      function* toolbarActionWithDependentBadges(
        action: ReturnType<typeof toolbarAction>,
      ): SagaIterator {
        yield call(handleCardtextToolbarAction, action)
        const { key, section } = action.payload
        if (
          section === 'cardtextView' &&
          (key === 'addList' || key === 'removeFromList')
        ) {
          yield call(syncCardtextViewToolbarAddList)
        }
        if (
          key === 'applyLight' ||
          key === 'cardtextCheck' ||
          key === 'apply' ||
          (key === 'delete' &&
            section === 'cardtextView')
        ) {
          yield call(syncCardtextProcessedBadge)
          yield call(syncCardtextCreateDraftIndicator)
        }
      },
    ),
    takeEvery(setAlign.type, syncCardtextAlignIcons),
    takeEvery(loadCardtextTemplatesRequest.type, loadCardtextTemplatesSaga),
    takeEvery(loadCardtextTemplatesSuccess.type, function* (): SagaIterator {
      yield call(syncCardtextListBadge)
      yield call(syncCardtextViewToolbarAddList)
    }),
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
      deleteCardtextFromViewRequested.type,
      function* (): SagaIterator {
        yield call(handleDeleteCardtextFromView)
        yield call(syncCardtextProcessedBadge)
        yield call(syncCardtextCreateDraftIndicator)
        yield call(syncCardtextAddButtonStatus)
        yield call(syncCardtextViewToolbarAddList)
      },
    ),
    takeEvery(openCardtextFromMiniStripRequested.type, openCardtextFromMiniStripSaga),
    takeEvery(
      [
        setDraftEngaged.type,
        setCardtextViewEditMode.type,
        resetCardtextAssetToEmptyDraft.type,
        restoreCardtextSession.type,
        setCardtextId.type,
        clearText.type,
      ],
      function* (): SagaIterator {
        yield call(syncCardtextAddButtonStatus)
        yield call(syncCardtextCheckButtonStatus)
        yield call(syncCardtextMainToolbarApply)
        yield call(syncCardtextViewToolbarAddList)
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
        yield call(syncCardtextCheckButtonStatus)
        yield call(syncCardtextMainToolbarApply)
      },
    ),
    takeEvery(
      setStatus.type,
      function* (action: ReturnType<typeof setStatus>): SagaIterator {
        yield call(maybePersistCreateDraftOnExitView, action)
        if (action.payload === 'processed') {
          yield call(syncCardtextProcessedBadge)
        }
        yield call(syncCardtextCreateDraftIndicator)
        yield call(syncCardtextAddButtonStatus)
        yield call(syncCardtextCheckButtonStatus)
        yield call(syncCardtextMainToolbarApply)
        yield call(syncCardtextViewToolbarAddList)
      },
    ),
    takeEvery(
      setCardtextAddTemplateOpen.type,
      function* (
        action: ReturnType<typeof setCardtextAddTemplateOpen>,
      ): SagaIterator {
        const isOpen = action.payload
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
