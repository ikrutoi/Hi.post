import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setStatus,
  loadCardtextTemplatesRequest,
  updateCardtextContentInList,
  clearText,
  clearCardtextTemplatesListSelection,
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  setDraftFocus,
  setCardtextId,
  clearDraftData,
  setCardtextAppliedData,
  toggleCardtextListSortDirection,
  toggleCardtextListPanelDensity,
  resetCardtextAssetToEmptyDraft,
  restoreCardtextSession,
  setDraftEngaged,
  setCardtextPresetData,
  setCardtextViewEditMode,
  setDraftData,
  setTitle,
} from '@cardtext/infrastructure/state'
import { changeFontSizeStep } from './cardtextHandlers'
import { closeCardPieListPanelAndSyncIconsSaga } from './exclusiveListPanelsSaga'
import type { RootState } from '@app/state'
import { isEmptyCardtextValue } from '@cardtext/domain/helpers'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextId,
  selectCardtextPlainText,
  selectCardtextLines,
  selectCardtextInteractionMode,
  selectCardtextAssetStatus,
} from '@cardtext/infrastructure/selectors'
import type { CardtextStatus } from '@cardtext/domain/editor/editor.types'
import { checkAndSyncProcessedCard } from './syncProcessedCard'
import type { CardtextInteractionMode } from '@cardtext/domain/cardtextInteractionMode'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import { findCardtextQuickListMatch } from '@cardtext/domain/helpers/cardtextQuickListMatch'
import { resolveCardtextTemplateTitle } from '@cardtext/application/helpers/resolveCardtextTemplateTitle'
import { suggestCardtextTemplateTitle } from '@cardtext/application/helpers/suggestCardtextTemplateTitle'
import { selectCardtextTemplatesListItems } from '@cardtext/infrastructure/selectors'
import { applyCardtextFromToolbar } from './cardtextToolbarApplySaga'
import { templateService } from '@entities/templates/domain/services/templateService'
import type { TemplateOperationResult } from '@entities/templates/domain/types/template.types'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  anyPostcardReferencesCardtextTemplateId,
  type PostcardHydrated,
} from '@entities/postcard'
import {
  addCardtextTemplateId,
  removeCardtextTemplateId,
} from '@features/previewStrip/infrastructure/state'

function* ensureCardtextTemplatesListPanelOpenSaga(): SagaIterator {
  yield call(closeCardPieListPanelAndSyncIconsSaga)

  const isOpen: boolean = yield select(
    (state: RootState) => state.cardtext.isListPanelOpen === true,
  )
  if (isOpen) return
  yield put(setCardtextListPanelOpen(true))
  yield put(loadCardtextTemplatesRequest())
}

function* clearCardtextEditorSlotsAfterAddToListSaga(): SagaIterator {
  yield call([templateService, 'deleteSingleCardtextByStatus'], 'processed')
  yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
  yield put(clearDraftData())
}

function* handleCardtextViewAddList(): SagaIterator {
  const plainText: string = yield select(selectCardtextPlainText)
  if (!(plainText?.trim?.() ?? '').length) return

  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const style: ReturnType<typeof selectCardtextStyle> =
    yield select(selectCardtextStyle)
  const cardtextLines: number = yield select(selectCardtextLines)
  const { assetData } = yield select((s: RootState) => s.cardtext)
  let templateId: string | null = yield select(selectCardtextId)
  if (
    templateId == null &&
    assetData?.status === 'processed' &&
    assetData?.id != null
  ) {
    templateId = String(assetData.id)
  }
  const templates: CardtextContent[] | null = yield select(
    selectCardtextTemplatesListItems,
  )

  if (
    findCardtextQuickListMatch(plainText, templates, templateId) != null
  ) {
    return
  }

  if (templateId != null) {
    const result: { success?: boolean } = yield call(
      [templateService, 'updateCardtextTemplate'],
      templateId,
      {
        value: value ?? [],
        style,
        plainText,
        cardtextLines,
        status: 'inLine',
      },
    )
    if (result?.success) {
      yield put(setStatus('inLine'))
      yield put(
        updateCardtextContentInList({
          id: templateId,
          value: value ?? [],
          style,
          plainText,
          cardtextLines,
        }),
      )
      yield call(clearCardtextEditorSlotsAfterAddToListSaga)
      yield put(loadCardtextTemplatesRequest())
    }
    return
  }

  const existingTitles = (templates ?? []).map((t) => t.title ?? '')
  const resolvedTitle = resolveCardtextTemplateTitle(
    plainText,
    existingTitles,
    assetData?.title,
  )
  const result: TemplateOperationResult = yield call(
    [templateService, 'createCardtextTemplate'],
    {
      value: value ?? [],
      style,
      plainText,
      cardtextLines,
      title: resolvedTitle,
      favorite: assetData?.favorite ?? null,
      status: 'inLine',
    },
  )
  if (result.success && result.templateId) {
    const newId = String(result.templateId)
    yield put(addCardtextTemplateId(newId))
    yield put(setCardtextId(newId))
    yield put(setStatus('inLine'))
    yield call(clearCardtextEditorSlotsAfterAddToListSaga)
    yield put(loadCardtextTemplatesRequest())
  }
}

function* handleCardtextViewRemoveFromList(): SagaIterator {
  const plainText: string = yield select(selectCardtextPlainText)
  const templateId: string | null = yield select(selectCardtextId)
  const templates: CardtextContent[] | null = yield select(
    selectCardtextTemplatesListItems,
  )
  const match = findCardtextQuickListMatch(plainText, templates, templateId)
  if (match?.id == null) return

  const id = String(match.id)
  const result: { success?: boolean } = yield call(
    [templateService, 'updateCardtextTemplate'],
    id,
    { status: 'outLine' },
  )
  if (!result?.success) return

  yield put(setStatus('outLine'))
  yield put(loadCardtextTemplatesRequest())
}

function cloneCardtextBranch(c: CardtextContent): CardtextContent {
  return {
    ...c,
    value: c.value.map((b) => ({
      ...b,
      children: b.children.map((ch) => ({ ...ch })),
    })),
    style: { ...c.style },
  }
}

function* deleteCardtextTemplateFromDb(templateId: string | null): SagaIterator {
  if (templateId == null) return
  const id = String(templateId)
  const result: { success?: boolean } = yield call(
    [templateService, 'deleteCardtextTemplate'],
    id,
  )
  if (result?.success) {
    yield put(removeCardtextTemplateId(id))
  }
}

/** Processed-слот: убрать текст с открытки и удалить processed/draft из БД. */
function* handleCardtextProcessedDelete(): SagaIterator {
  yield call([templateService, 'deleteSingleCardtextByStatus'], 'processed')
  yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
  yield put(clearDraftData())
  yield put(setCardtextPresetData(null))
  yield put(clearText())
  yield put(loadCardtextTemplatesRequest())
}

/** View / шаблон на открытке: очистить текст и удалить запись шаблона из БД. */
function* handleCardtextPostcardViewDelete(): SagaIterator {
  const { assetData, appliedData } = yield select((s: RootState) => s.cardtext)
  const templateIds = new Set<string>()
  if (assetData?.id != null) templateIds.add(String(assetData.id))
  if (appliedData?.id != null) templateIds.add(String(appliedData.id))
  const selectedId: string | null = yield select(selectCardtextId)
  if (selectedId != null) templateIds.add(String(selectedId))

  for (const id of templateIds) {
    yield call(deleteCardtextTemplateFromDb, id)
  }

  yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
  yield put(clearDraftData())
  yield put(setCardtextPresetData(null))
  yield put(clearText())
  yield put(loadCardtextTemplatesRequest())
}

function* syncDraftDataOnCloseFromDraftSession(
  asset: CardtextContent | null,
): SagaIterator {
  if (asset == null || asset.status !== 'draft') return
  const plain = (asset.plainText ?? '').trim()
  if (!plain.length) {
    yield put(clearDraftData())
    return
  }
  const draft: CardtextContent = {
    id: null,
    status: 'draft',
    value: asset.value.map((b) => ({
      ...b,
      children: b.children.map((c) => ({ ...c })),
    })),
    style: { ...asset.style },
    title: asset.title ?? '',
    plainText: asset.plainText,
    cardtextLines: asset.cardtextLines,
    favorite: asset.favorite ?? null,
    timestamp: asset.timestamp,
  }
  yield put(setDraftData(draft))
}

/** CardEditor / cardtextCreate: закрыть форму редактирования (логика бывшей overlay close). */
export function* handleCloseCardtextEditorSaga(): SagaIterator {
  yield put(setDraftFocus(false))

  const { assetData: cardtextAssetData, presetData: cardtextPresetData } =
    yield select((s: RootState) => s.cardtext)

  if (cardtextAssetData == null) {
    yield put(setDraftEngaged(false))
    if (cardtextPresetData != null) {
      yield put(restoreCardtextSession(cardtextPresetData))
    }
    return
  }

  if (
    cardtextPresetData != null &&
    cardtextPresetData.status === 'processed' &&
    cardtextAssetData.status === 'draft'
  ) {
    yield put(
      restoreCardtextSession({
        ...cardtextPresetData,
        value: cardtextPresetData.value.map((b) => ({
          ...b,
          children: b.children.map((c) => ({ ...c })),
        })),
        style: { ...cardtextPresetData.style },
      }),
    )
    yield put(setCardtextPresetData(null))
    yield put(setDraftEngaged(false))
    return
  }

  const assetId = cardtextAssetData.id ?? null
  const presetId = cardtextPresetData?.id ?? null
  const st = cardtextAssetData.status

  if (st === 'inLine' || st === 'outLine') {
    yield put(setCardtextViewEditMode(false))
    if (cardtextPresetData != null) {
      yield put(restoreCardtextSession(cardtextPresetData))
    } else {
      yield put(setStatus(st))
    }
    return
  }

  if (
    cardtextPresetData != null &&
    presetId != null &&
    String(assetId) !== String(presetId)
  ) {
    yield call(syncDraftDataOnCloseFromDraftSession, cardtextAssetData)
    yield put(restoreCardtextSession(cardtextPresetData))
    return
  }
  if (cardtextPresetData == null && cardtextAssetData.status === 'draft') {
    yield call(syncDraftDataOnCloseFromDraftSession, cardtextAssetData)
    yield put(resetCardtextAssetToEmptyDraft())
    return
  }

  yield call(syncDraftDataOnCloseFromDraftSession, cardtextAssetData)
  yield put(setCardtextViewEditMode(false))
  yield put(setStatus('inLine'))
}

/** CardEditor: удалить текущий черновик / текст (не трогает список шаблонов целиком). */
export function* handleDeleteCardtextEditorSaga(): SagaIterator {
  const interactionMode: CardtextInteractionMode = yield select(
    selectCardtextInteractionMode,
  )
  const presetData: CardtextContent | null = yield select(
    (s: RootState) => s.cardtext.presetData,
  )

  if (interactionMode === 'createEmpty') {
    yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
    yield put(clearDraftData())
    yield put(setDraftFocus(false))

    if (presetData?.status === 'processed') {
      yield put(
        restoreCardtextSession({
          ...presetData,
          value: presetData.value.map((b) => ({
            ...b,
            children: b.children.map((c) => ({ ...c })),
          })),
          style: { ...presetData.style },
        }),
      )
      yield put(setCardtextPresetData(null))
      yield put(setDraftEngaged(false))
      yield put(setStatus('processed'))
      yield call(checkAndSyncProcessedCard)
      return
    }

    yield put(resetCardtextAssetToEmptyDraft())
    yield put(setDraftEngaged(false))
    return
  }

  yield call(handleDeleteCardtextFromView)
}

/** View: закрыть форму просмотра шаблона (пустой create). */
export function* handleCloseCardtextView(): SagaIterator {
  yield put(setCardtextViewEditMode(false))
  yield put(setCardtextAddTemplateOpen(false))
  yield put(setCardtextPresetData(null))
  yield put(clearCardtextTemplatesListSelection())
  yield put(resetCardtextAssetToEmptyDraft())
  yield put(setDraftEngaged(false))
  yield put(setDraftFocus(false))
}

/** View / Processed: удаление текста (не зависит от section в toolbarAction). */
export function* handleDeleteCardtextFromView(): SagaIterator {
  const assetStatus: CardtextStatus = yield select(selectCardtextAssetStatus)
  const interactionMode: CardtextInteractionMode = yield select(
    selectCardtextInteractionMode,
  )

  if (assetStatus === 'processed' || interactionMode === 'processedSlot') {
    yield call(handleCardtextProcessedDelete)
  } else {
    yield call(handleCardtextPostcardViewDelete)
  }

  yield put(setCardtextViewEditMode(false))
  yield put(setDraftEngaged(false))
  yield call(checkAndSyncProcessedCard)
}

export function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key, payload: editor } = action.payload

  if (
    section === 'cardtextList' &&
    (key === 'sortAZDown' || key === 'sortAZUp' || key === 'sortDown')
  ) {
    yield put(toggleCardtextListSortDirection())
    return
  }

  if (section === 'cardtextList' && key === 'panelDensity2') {
    yield put(toggleCardtextListPanelDensity())
    return
  }

  const isCardtextSection =
    section === 'cardtext' ||
    section === 'cardtextView' ||
    section === 'cardtextEditor' ||
    section === 'cardtextCreate'
  if (!isCardtextSection) return

  const interactionMode: CardtextInteractionMode =
    action.payload.cardtextInteractionMode ??
    (yield select(selectCardtextInteractionMode))

  switch (key) {
    case 'apply': {
      yield call(applyCardtextFromToolbar, action)
      break
    }

    case 'applyLight':
    case 'cardtextCheck': {
      const value: ReturnType<typeof selectCardtextValue> =
        yield select(selectCardtextValue)
      const style: ReturnType<typeof selectCardtextStyle> =
        yield select(selectCardtextStyle)
      const plainText: string = yield select(selectCardtextPlainText)
      const cardtextLines: number = yield select(selectCardtextLines)
      const { assetData } = yield select((s: RootState) => s.cardtext)
      const templateIdFromSelect: string | null =
        yield select(selectCardtextId)

      const hasText = (plainText?.trim?.() ?? '').length > 0
      if (!hasText) break

      const templates: CardtextContent[] | null = yield select(
        selectCardtextTemplatesListItems,
      )
      const existingTitles = (templates ?? []).map((t) => t.title ?? '')
      const resolvedTitle = resolveCardtextTemplateTitle(
        plainText,
        existingTitles,
        assetData?.title,
      )

      const postcardSt = assetData?.status
      if (postcardSt === 'inLine' || postcardSt === 'outLine') {
        const id =
          assetData?.id != null
            ? String(assetData.id)
            : templateIdFromSelect != null
              ? String(templateIdFromSelect)
              : null
        if (id == null) break

        const cartItems: PostcardHydrated[] = yield select(selectCartItems)
        const referencedByPostcard =
          anyPostcardReferencesCardtextTemplateId(cartItems, id)

        if (referencedByPostcard) {
          const createResult: TemplateOperationResult = yield call(
            [templateService, 'createCardtextTemplate'],
            {
              value,
              style,
              plainText,
              cardtextLines,
              title: resolvedTitle,
              favorite: assetData?.favorite ?? null,
              status: postcardSt,
            },
          )
          if (createResult.success && createResult.templateId) {
            const newId = String(createResult.templateId)
            yield put(addCardtextTemplateId(newId))
            yield put(setCardtextId(newId))
            if (resolvedTitle) yield put(setTitle(resolvedTitle))
            yield put(setCardtextViewEditMode(false))
            yield put(setDraftEngaged(false))
            yield put(setStatus(postcardSt))
            yield put(loadCardtextTemplatesRequest())
          }
          break
        }

        const result: { success?: boolean } = yield call(
          [templateService, 'updateCardtextTemplate'],
          id,
          {
            value,
            style,
            plainText,
            cardtextLines,
            title: resolvedTitle,
            favorite: assetData?.favorite ?? null,
          },
        )
        if (result?.success) {
          yield put(
            updateCardtextContentInList({
              id,
              value: value ?? [],
              style,
              plainText,
              cardtextLines,
            }),
          )
          if (resolvedTitle) yield put(setTitle(resolvedTitle))
          yield put(setCardtextViewEditMode(false))
          yield put(setDraftEngaged(false))
          yield put(setStatus(postcardSt))
          yield put(loadCardtextTemplatesRequest())
        }
        break
      }

      const processedTitle =
        resolvedTitle || suggestCardtextTemplateTitle(plainText)

      const result: { success?: boolean; templateId?: string } = yield call(
        [templateService, 'upsertSingleCardtextByStatus'],
        'processed',
        {
          value,
          style,
          plainText,
          cardtextLines,
          title: processedTitle,
          favorite: assetData?.favorite ?? null,
          status: 'processed',
        },
      )

      if (result?.success && result.templateId) {
        const templateId = String(result.templateId)
        yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
        yield put(clearDraftData())
        yield put(clearCardtextTemplatesListSelection())
        yield put(setCardtextPresetData(null))
        yield put(setCardtextId(templateId))
        yield put(setStatus('processed'))
        if (processedTitle) yield put(setTitle(processedTitle))
        yield put(setCardtextViewEditMode(false))
        yield put(setDraftEngaged(false))
        yield put(loadCardtextTemplatesRequest())
      }
      break
    }

    case 'edit':
      if (interactionMode === 'processedSlot') {
        // Редактор черновика: appliedData не трогаем (только Apply на открытке).
        // Снимок processed — в presetData для отмены по close в CardEditor.
        yield put(setCardtextViewEditMode(false))
        const { assetData: slotAsset } = yield select(
          (s: RootState) => s.cardtext,
        )
        if (slotAsset != null && slotAsset.status === 'processed') {
          yield put(setCardtextPresetData(cloneCardtextBranch(slotAsset)))
        }
        yield put(setCardtextId(null))
        yield put(setStatus('draft'))
        yield put(setDraftEngaged(true))
        yield put(setDraftFocus(true))
      } else if (
        interactionMode === 'postcardTemplateView' ||
        section === 'cardtextView'
      ) {
        const { assetData: editAsset } = yield select(
          (s: RootState) => s.cardtext,
        )
        const st = editAsset?.status
        if (st === 'inLine' || st === 'outLine') {
          yield put(setCardtextViewEditMode(true))
          yield put(setDraftEngaged(true))
          yield put(setDraftFocus(true))
        } else {
          yield put(setCardtextViewEditMode(false))
          yield put(setStatus('draft'))
          yield put(setDraftEngaged(true))
          yield put(setDraftFocus(true))
        }
      } else if (interactionMode === 'editTemplate') {
        const templateId: string | null = yield select(selectCardtextId)
        const value: ReturnType<typeof selectCardtextValue> =
          yield select(selectCardtextValue)
        const style: ReturnType<typeof selectCardtextStyle> =
          yield select(selectCardtextStyle)
        const plainText: string = yield select(selectCardtextPlainText)
        const cardtextLines: number = yield select(selectCardtextLines)

        // If we are editing an existing template, persist changes on exit
        if (templateId) {
          const result = yield call(
            templateService.updateCardtextTemplate,
            templateId,
            { value, style, plainText, cardtextLines },
          )
          if (result?.success) {
            yield put(
              updateCardtextContentInList({
                id: templateId,
                value: value ?? [],
                style,
                plainText,
                cardtextLines,
              }),
            )
          }
        }

        yield put(setStatus('processed'))
        yield put(setCardtextViewEditMode(false))
      }
      break

    case 'delete':
      if (section === 'cardtextEditor' || section === 'cardtextCreate') {
        yield call(handleDeleteCardtextEditorSaga)
        break
      }
      if (
        section === 'cardtext' ||
        section === 'cardtextView' ||
        interactionMode === 'processedSlot' ||
        interactionMode === 'postcardTemplateView' ||
        interactionMode === 'editTemplate' ||
        interactionMode === 'editFromPostcardView'
      ) {
        yield call(handleDeleteCardtextFromView)
      }
      break

    case 'fontSizeLess':
      if (
        section === 'cardtext' ||
        section === 'cardtextEditor' ||
        section === 'cardtextCreate'
      ) {
        yield call(changeFontSizeStep, editor, 'less')
      }
      break

    case 'fontSizeMore':
      if (
        section === 'cardtext' ||
        section === 'cardtextEditor' ||
        section === 'cardtextCreate'
      ) {
        yield call(changeFontSizeStep, editor, 'more')
      }
      break

    case 'listCardtext': {
      const nextOpen: boolean = yield select(
        (state: RootState) => !(state.cardtext.isListPanelOpen === true),
      )
      yield put(setCardtextListPanelOpen(nextOpen))
      if (nextOpen) {
        yield put(loadCardtextTemplatesRequest())
      }
      break
    }

    case 'addList': {
      if (section === 'cardtextView') {
        yield call(handleCardtextViewAddList)
        yield call(ensureCardtextTemplatesListPanelOpenSaga)
        break
      }
      break
    }

    case 'close':
      if (section === 'cardtextView') {
        yield call(handleCloseCardtextView)
      } else if (section === 'cardtextEditor' || section === 'cardtextCreate') {
        yield call(handleCloseCardtextEditorSaga)
      }
      break

    case 'removeFromList': {
      if (section === 'cardtextView') {
        yield call(handleCardtextViewRemoveFromList)
        break
      }
      break
    }

    case 'listAdd': {
      const isOpen: boolean = yield select(
        (state: RootState) => state.cardtext.isAddTemplateOpen ?? false,
      )
      yield put(setCardtextAddTemplateOpen(!isOpen))
      break
    }

    case 'cardtextAdd': {
      if (section === 'cardtext' || section === 'cardtextView') {
        yield put(setCardtextAddTemplateOpen(false))
        const postcardAsset: CardtextContent | null = yield select(
          (s: RootState) => s.cardtext.assetData,
        )
        if (
          postcardAsset != null &&
          (postcardAsset.status === 'inLine' ||
            postcardAsset.status === 'outLine') &&
          !isEmptyCardtextValue(postcardAsset.value)
        ) {
          yield put(setCardtextPresetData(cloneCardtextBranch(postcardAsset)))
        }
        const processed: ReturnType<typeof templateService.getSingleCardtextByStatus> =
          yield call([templateService, 'getSingleCardtextByStatus'], 'processed')
        if (processed != null) {
          yield put(restoreCardtextSession(processed))
          if (processed.id != null) {
            yield put(setCardtextId(String(processed.id)))
          }
          yield put(setStatus('processed'))
          yield put(setDraftFocus(false))
          break
        }
        const draftFromDb: ReturnType<typeof templateService.getSingleCardtextByStatus> =
          yield call([templateService, 'getSingleCardtextByStatus'], 'draft')
        if (draftFromDb != null) {
          yield put(
            restoreCardtextSession({
              ...draftFromDb,
              id: null,
              status: 'draft',
            }),
          )
          yield put(setCardtextId(null))
          yield put(setStatus('draft'))
        } else {
          yield put(resetCardtextAssetToEmptyDraft())
        }
        yield put(setDraftEngaged(true))
        yield put(setDraftFocus(true))
        // Keep list badge consistent after entering "new template" mode.
        // Some flows can temporarily make `templatesList` look empty/null
        // before the UI updates, so we re-fetch.
        yield put(loadCardtextTemplatesRequest())
        break
      }
      const value: any = yield select(selectCardtextValue)
      const isAssetDraft: boolean = yield select(
        (s: RootState) =>
          s.cardtext.assetData == null ||
          s.cardtext.assetData.status === 'draft',
      )
      const isEmpty =
        isAssetDraft &&
        (!value?.length ||
          (value.length === 1 &&
            !(
              value[0]?.children?.map((c: any) => c?.text).join('') ?? ''
            ).trim()))
      if (isEmpty) {
        yield put(setDraftEngaged(true))
        yield put(setDraftFocus(true))
      }
      break
    }
  }
}
