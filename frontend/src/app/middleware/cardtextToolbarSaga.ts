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
  clearText,
  resetCardtextAssetToEmptyDraft,
  setCardtextPresetData,
  restoreCardtextSession,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextId,
  selectCardtextFavorite,
  selectCardtextPlainText,
  selectCardtextLines,
  selectCardtextSessionData,
} from '@cardtext/infrastructure/selectors'
import { templateService } from '@entities/templates/domain/services/templateService'

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

  switch (key) {
    case 'apply': {
      // Apply: положить текущий текст на открытку (`appliedData`) и выставить статусы.
      // Сохранённый «processed» в БД при этом переводим в `outLine` (не путать с шаблонами inLine).
      // Шаблоны inLine/outLine с открытки не переводим в processed — статус сохраняем.
      const { assetData } = yield select((s: RootState) => s.cardtext)
      if (assetData == null) break

      const value: ReturnType<typeof selectCardtextValue> =
        yield select(selectCardtextValue)
      const style: ReturnType<typeof selectCardtextStyle> =
        yield select(selectCardtextStyle)
      const plainText: string = yield select(selectCardtextPlainText)
      const cardtextLines: number = yield select(selectCardtextLines)

      if (assetData.status === 'processed') {
        let templateId: string | null = assetData.id
        if (templateId == null) {
          const fromDb =
            yield call([templateService, 'getSingleCardtextByStatus'], 'processed')
          templateId = fromDb?.id != null ? String(fromDb.id) : null
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
              title: assetData.title ?? '',
              favorite: assetData.favorite ?? null,
              status: 'outLine',
            },
          )
          if (!result?.success) break
        }

        const next = {
          ...assetData,
          value,
          style,
          plainText,
          cardtextLines,
          status: 'outLine' as const,
          id: templateId ?? assetData.id,
        }
        yield put(setCardtextAppliedData(next))
        yield put(restoreCardtextSession(next))
        yield put(loadCardtextTemplatesRequest())
        break
      }

      const nextStatus =
        assetData.status === 'inLine' || assetData.status === 'outLine'
          ? assetData.status
          : ('processed' as const)

      const applied = {
        ...assetData,
        value,
        style,
        plainText,
        cardtextLines,
        status: nextStatus,
      }
      yield put(setCardtextAppliedData(applied))
      yield put(setStatus(nextStatus))
      break
    }

    case 'cardtextCheck': {
      const value: ReturnType<typeof selectCardtextValue> =
        yield select(selectCardtextValue)
      const style: ReturnType<typeof selectCardtextStyle> =
        yield select(selectCardtextStyle)
      const plainText: string = yield select(selectCardtextPlainText)
      const cardtextLines: number = yield select(selectCardtextLines)
      const { assetData } = (yield select((s: RootState) => s.cardtext)) as {
        assetData?: { title?: string; favorite?: boolean | null } | null
      }

      const hasText = (plainText?.trim?.() ?? '').length > 0
      if (!hasText) break

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
      if (section === 'cardtextView') {
        yield put(setStatus('draft'))
      } else if (section === 'cardtextProcessed') {
        // Edit from processed mode should open create editor flow
        // with current text content.
        yield put(setCardtextAppliedData(null))
        yield put(setCardtextId(null))
        yield put(setStatus('draft'))
        yield put(setDraftFocus(true))
      } else if (section === 'cardtextEditor') {
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
      }
      break

    case 'favorite':
      if (section === 'cardtextView') {
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
      if (section === 'cardtextProcessed') {
        yield call([templateService, 'deleteSingleCardtextByStatus'], 'processed')
        yield put(setCardtextAppliedData(null))
        yield put(setCardtextId(null))
        yield put(clearText())
        yield put(setStatus('inLine'))
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
        const snapshot: ReturnType<typeof selectCardtextSessionData> =
          yield select(selectCardtextSessionData)
        // Preserve "return target" when leaving a selected preset for create mode.
        if (snapshot?.id != null) {
          yield put(setCardtextPresetData(snapshot))
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
        } else {
          yield put(resetCardtextAssetToEmptyDraft())
        }
        yield put(setCardtextId(null))
        yield put(setStatus('draft'))
        yield put(setDraftFocus(true))
        // Keep list badge consistent after entering "new template" mode.
        // Some flows can temporarily make `templatesList` look empty/null
        // before the UI updates, so we re-fetch.
        yield put(loadCardtextTemplatesRequest())
        break
      }
      const value: any = yield select(selectCardtextValue)
      const isAssetDraft: boolean = yield select(
        (s: RootState) => s.cardtext.assetData?.status === 'draft',
      )
      const isEmpty =
        isAssetDraft &&
        (!value?.length ||
          (value.length === 1 &&
            !(
              value[0]?.children?.map((c: any) => c?.text).join('') ?? ''
            ).trim()))
      if (isEmpty) {
        yield put(setDraftFocus(true))
      }
      break
    }
  }
}
