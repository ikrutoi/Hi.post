import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setStatus,
  loadCardtextTemplatesRequest,
  updateCardtextContentInList,
  clearText,
  clearCardtextProcessedSlotBackup,
} from '@cardtext/infrastructure/state'
import { changeFontSizeStep } from './cardtextHandlers'
import type { RootState } from '@app/state'
import {
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
} from '@cardtext/infrastructure/state'
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

function* handleCardtextViewAddList(): SagaIterator {
  const plainText: string = yield select(selectCardtextPlainText)
  if (!(plainText?.trim?.() ?? '').length) return

  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const style: ReturnType<typeof selectCardtextStyle> =
    yield select(selectCardtextStyle)
  const cardtextLines: number = yield select(selectCardtextLines)
  const templateId: string | null = yield select(selectCardtextId)
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
      yield put(loadCardtextTemplatesRequest())
    }
    return
  }

  const { assetData } = yield select((s: RootState) => s.cardtext)
  const result: TemplateOperationResult = yield call(
    [templateService, 'createCardtextTemplate'],
    {
      value: value ?? [],
      style,
      plainText,
      cardtextLines,
      title: assetData?.title ?? '',
      favorite: assetData?.favorite ?? null,
      status: 'inLine',
    },
  )
  if (result.success && result.templateId) {
    const newId = String(result.templateId)
    yield put(addCardtextTemplateId(newId))
    yield put(setCardtextId(newId))
    yield put(setStatus('inLine'))
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
  yield put(clearCardtextProcessedSlotBackup())
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

  if (section === 'cardtextList' && key === 'sortDown') {
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
    section === 'cardtextCreate' ||
    section === 'cardtextProcessed'
  if (!isCardtextSection) return

  const interactionMode: CardtextInteractionMode =
    action.payload.cardtextInteractionMode ??
    (yield select(selectCardtextInteractionMode))

  switch (key) {
    case 'apply': {
      yield call(applyCardtextFromToolbar, action)
      break
    }

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
              title: assetData?.title ?? '',
              favorite: assetData?.favorite ?? null,
              status: postcardSt,
            },
          )
          if (createResult.success && createResult.templateId) {
            const newId = String(createResult.templateId)
            yield put(addCardtextTemplateId(newId))
            yield put(setCardtextId(newId))
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
            title: assetData?.title ?? '',
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
          yield put(setCardtextViewEditMode(false))
          yield put(setDraftEngaged(false))
          yield put(setStatus(postcardSt))
          yield put(loadCardtextTemplatesRequest())
        }
        break
      }

      const result: { success?: boolean; templateId?: string } = yield call(
        [templateService, 'upsertSingleCardtextByStatus'],
        'processed',
        {
          value,
          style,
          plainText,
          cardtextLines,
          title: assetData?.title ?? '',
          favorite: assetData?.favorite ?? null,
          status: 'processed',
        },
      )

      if (result?.success && result.templateId) {
        const templateId = String(result.templateId)
        yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
        yield put(clearDraftData())
        yield put(setCardtextId(templateId))
        yield put(setStatus('processed'))
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
      if (
        section === 'cardtext' ||
        section === 'cardtextView' ||
        section === 'cardtextProcessed' ||
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
        break
      }
      break
    }

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
          yield put(clearCardtextProcessedSlotBackup())
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
