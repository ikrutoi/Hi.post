import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setCardtextAppliedData,
  setCardtextViewEditMode,
  loadCardtextTemplatesRequest,
  restoreCardtextSession,
  clearDraftData,
  setDraftEngaged,
  setCardtextApplyPeekChrome,
  setCardtextListPanelOpen,
} from '@cardtext/infrastructure/state'
import type { RootState } from '@app/state'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextPlainText,
  selectCardtextLines,
  selectCardtextAssetMatchesApplied,
} from '@cardtext/infrastructure/selectors'
import { templateService } from '@entities/templates/domain/services/templateService'
import { suggestCardtextTemplateTitle } from '@cardtext/application/helpers/suggestCardtextTemplateTitle'
import { requestArchiveSectionPeek } from '@cardPanel/infrastructure/state'
import { selectCartItems, selectCartListSelectedLocalId } from '@cart/infrastructure/selectors'
import { selectHistoryListSelectedLocalId } from '@date/calendar/infrastructure/selectors'
import { updateItem } from '@cart/infrastructure/state'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import type { PostcardHydrated } from '@entities/postcard'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

/**
 * Apply: положить текущий текст на открытку (`appliedData`) и выставить статусы.
 * Сохранённый «processed» в БД при этом переводим в `outLine`.
 * Шаблоны inLine/outLine с открытки не переводим в processed — статус сохраняем.
 * После Apply — упрощённый view (CardtextView); для archive-edit ещё и peek chrome.
 */
export function* applyCardtextFromToolbar(
  _action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const assetMatchesApplied: boolean = yield select(
    selectCardtextAssetMatchesApplied,
  )

  /** Сборка: CardtextView; archive-edit: App/Toolbar включает peek chrome. */
  const enterSimplifiedAfterApply = function* (
    appliedContent: CardtextContent | null,
  ): SagaIterator {
    if (appliedContent != null) {
      const cartSelected: number | null = yield select(
        selectCartListSelectedLocalId,
      )
      const historySelected: number | null = yield select(
        selectHistoryListSelectedLocalId,
      )
      const localId = cartSelected ?? historySelected
      if (localId != null) {
        const items: PostcardHydrated[] = yield select(selectCartItems)
        const postcard = items.find((p) => p.localId === localId)
        if (postcard != null) {
          const nextPostcard: PostcardHydrated = {
            ...postcard,
            updatedAt: Date.now(),
            card: {
              ...postcard.card,
              cardtext: {
                ...postcard.card.cardtext,
                appliedData: appliedContent,
                assetData: appliedContent,
              },
            },
          }
          try {
            yield call(postcardsAdapter.put, nextPostcard)
          } catch (e) {
            console.error('applyCardtextFromToolbar: persist failed', e)
          }
          yield put(updateItem(nextPostcard))
          yield put(postcardLocalDataChanged())
        }
      }
      yield put(setCardtextAppliedData(appliedContent))
      yield put(restoreCardtextSession(appliedContent))
    } else {
      const { assetData, appliedData } = yield select(
        (s: RootState) => s.cardtext,
      )
      const session = appliedData ?? assetData
      if (session != null) {
        yield put(restoreCardtextSession(session))
      } else {
        yield put(setDraftEngaged(false))
        yield put(setCardtextViewEditMode(false))
      }
    }
    yield put(setCardtextApplyPeekChrome(true))
    yield put(setCardtextListPanelOpen(false))
    yield put(requestArchiveSectionPeek('cardtext'))
  }

  if (assetMatchesApplied) {
    /** Уже на открытке — не toggle-off; выходим в упрощённый view / peek. */
    yield call(enterSimplifiedAfterApply, null)
    return
  }

  const { assetData } = yield select((s: RootState) => s.cardtext)
  if (assetData == null) return

  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const style: ReturnType<typeof selectCardtextStyle> =
    yield select(selectCardtextStyle)
  const plainText: string = yield select(selectCardtextPlainText)
  const cardtextLines: number = yield select(selectCardtextLines)
  const resolvedTitle =
    assetData.title?.trim() || suggestCardtextTemplateTitle(plainText)

  if (assetData.status === 'processed') {
    let templateId: string | null = assetData.id
    if (templateId == null) {
      const upsert: { success?: boolean; templateId?: string } = yield call(
        [templateService, 'upsertSingleCardtextByStatus'],
        'processed',
        {
          value,
          style,
          plainText,
          cardtextLines,
          title: resolvedTitle,
          favorite: assetData.favorite ?? null,
          status: 'processed',
        },
      )
      if (!upsert?.success || upsert.templateId == null) return
      templateId = String(upsert.templateId)
    }

    if (templateId != null) {
      const result: { success?: boolean } = yield call(
        [templateService, 'updateCardtextTemplate'],
        templateId,
        {
          value,
          style,
          plainText,
          cardtextLines,
          title: resolvedTitle,
          favorite: assetData.favorite ?? null,
          status: 'outLine',
        },
      )
      if (!result?.success) return
    }

    const next = {
      ...assetData,
      value,
      style,
      plainText,
      cardtextLines,
      title: resolvedTitle,
      status: 'outLine' as const,
      id: templateId ?? assetData.id,
    }
    yield call([templateService, 'deleteSingleCardtextByStatus'], 'draft')
    yield put(clearDraftData())
    yield put(loadCardtextTemplatesRequest())
    yield call(enterSimplifiedAfterApply, next)
    return
  }

  const nextStatus =
    assetData.status === 'inLine' || assetData.status === 'outLine'
      ? assetData.status
      : ('processed' as const)

  let appliedId: string | null = assetData.id
  if (appliedId == null) {
    const persisted: { success?: boolean; templateId?: string } =
      nextStatus === 'processed'
        ? yield call([templateService, 'upsertSingleCardtextByStatus'], 'processed', {
            value,
            style,
            plainText,
            cardtextLines,
            title: resolvedTitle,
            favorite: assetData.favorite ?? null,
            status: 'processed',
          })
        : yield call([templateService, 'createCardtextTemplate'], {
            value,
            style,
            plainText,
            cardtextLines,
            title: resolvedTitle,
            favorite: assetData.favorite ?? null,
            status: nextStatus,
          })
    if (!persisted?.success || persisted.templateId == null) return
    appliedId = String(persisted.templateId)
  }

  const applied = {
    ...assetData,
    id: appliedId,
    value,
    style,
    plainText,
    cardtextLines,
    title: resolvedTitle,
    status: nextStatus,
  }
  yield call(enterSimplifiedAfterApply, applied)
}
