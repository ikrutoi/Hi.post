import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setStatus,
  setFavorite,
  loadCardtextTemplatesRequest,
  updateCardtextTemplateFavoriteInList,
  updateCardtextContentInList,
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
  resetCardtextAssetToEmptyDraft,
  restoreCardtextSession,
  setDraftEngaged,
  setCardtextViewEditMode,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextId,
  selectCardtextFavorite,
  selectCardtextPlainText,
  selectCardtextLines,
  selectCardtextInteractionMode,
} from '@cardtext/infrastructure/selectors'
import type { CardtextInteractionMode } from '@cardtext/domain/cardtextInteractionMode'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import { applyCardtextFromToolbar } from './cardtextToolbarApplySaga'
import { templateService } from '@entities/templates/domain/services/templateService'

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

export function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key, payload: editor } = action.payload

  if (section === 'cardtextList' && key === 'sortDown') {
    yield put(toggleCardtextListSortDirection())
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
      if (interactionMode === 'postcardTemplateView') {
        const { assetData: editAsset } = yield select(
          (s: RootState) => s.cardtext,
        )
        const st = editAsset?.status
        if (st === 'inLine' || st === 'outLine') {
          yield put(setCardtextViewEditMode(true))
        } else {
          yield put(setCardtextViewEditMode(false))
          yield put(setStatus('draft'))
        }
      } else if (interactionMode === 'processedSlot') {
        // Edit from processed mode should open create editor flow
        // with current text content.
        yield put(setCardtextViewEditMode(false))
        const { assetData: slotAsset } = yield select(
          (s: RootState) => s.cardtext,
        )
        if (
          slotAsset != null &&
          slotAsset.status === 'processed' &&
          slotAsset.id != null
        ) {
          yield put(setCardtextAppliedData(cloneCardtextBranch(slotAsset)))
        } else {
          yield put(setCardtextAppliedData(null))
        }
        yield put(setCardtextId(null))
        yield put(setStatus('draft'))
        yield put(setDraftFocus(true))
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

    case 'favorite':
      if (interactionMode === 'postcardTemplateView') {
        const templateId: string | null = yield select(selectCardtextId)
        if (!templateId) break
        const favorite: boolean = yield select(selectCardtextFavorite)
        const next = !favorite
        const result = yield call(
          templateService.updateCardtextTemplate,
          templateId,
          { favorite: next },
        )
        if (result?.success) {
          yield put(setFavorite(next))
          yield put(
            updateCardtextTemplateFavoriteInList({
              id: templateId,
              favorite: next,
            }),
          )
        }
      }
      break

    case 'delete':
      if (interactionMode === 'processedSlot') {
        yield call([templateService, 'deleteSingleCardtextByStatus'], 'processed')
        const presetData: CardtextContent | null = yield select(
          (s: RootState) => s.cardtext.presetData,
        )
        if (presetData != null) {
          yield put(restoreCardtextSession(presetData))
        } else {
          yield put(resetCardtextAssetToEmptyDraft())
        }
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
