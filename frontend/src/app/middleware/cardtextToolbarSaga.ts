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
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  setDraftFocus,
  setCardtextSource,
  setCardtextId,
  setCardtextAppliedData,
  toggleCardtextListSortDirection,
  setValue,
  restoreDraftData,
  setCardtextPresetData,
} from '@cardtext/infrastructure/state'
import { initialCardtextValue } from '@/features/cardtext/domain/editor/editor.types'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextShowViewMode,
  selectCardtextId,
  selectCardtextFavorite,
  selectCardtextPlainText,
  selectCardtextLines,
  selectCardtextDraftData,
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
    section === 'cardtextCreate'
  if (!isCardtextSection) return

  switch (key) {
    case 'apply': {
      // Apply means "processed state for the card": copy current editor content
      // into `appliedData` and mark section complete via `selectCardtextIsComplete`.
      const { assetData } = yield select((s: RootState) => s.cardtext)
      if (assetData == null) break

      const applied = {
        ...assetData,
        status: 'processed' as const,
      }

      yield put(setCardtextAppliedData(applied))
      // Keep legacy status in sync (some UI still relies on it).
      yield put(setStatus('processed'))
      yield put(setCardtextSource('view'))
      break
    }

    case 'edit':
      if (section === 'cardtextView') {
        yield put(setCardtextSource('draft'))
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
        yield put(setCardtextSource('view'))
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
      const current: any = (yield select(
        (state: RootState) => state.toolbar[section].listCardtext,
      )) as any
      const isActive = current?.state === 'active' || current === 'active'
      const nextState = isActive ? 'enabled' : 'active'
      const nextOpen = !isActive

      yield put(
        updateToolbarIcon({
          section,
          key: 'listCardtext',
          value: nextState,
        }),
      )
      yield put(setCardtextListPanelOpen(nextOpen))
      // Ensure badge count is immediately consistent when list opens.
      // This also avoids “badge disappears” after list toggle due to async state updates.
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
        // Starting a new editor session should clear any previously applied state.
        yield put(setCardtextAppliedData(null))
        const snapshot: ReturnType<typeof selectCardtextSessionData> =
          yield select(selectCardtextSessionData)
        // Preserve "return target" when leaving a selected preset for create mode.
        if (snapshot?.id != null) {
          yield put(setCardtextPresetData(snapshot))
        }
        const draft: ReturnType<typeof selectCardtextDraftData> =
          yield select(selectCardtextDraftData)
        if (draft) {
          yield put(restoreDraftData(draft))
        } else {
          yield put(setValue(initialCardtextValue as any))
        }
        yield put(setCardtextId(null))
        yield put(setCardtextSource('draft'))
        yield put(setDraftFocus(true))
        // Keep list badge consistent after entering "new template" mode.
        // Some flows can temporarily make `templatesList` look empty/null
        // before the UI updates, so we re-fetch.
        yield put(loadCardtextTemplatesRequest())
        break
      }
      const value: any = yield select(selectCardtextValue)
      const showViewMode: boolean = yield select(selectCardtextShowViewMode)
      const isEmpty =
        !showViewMode &&
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
