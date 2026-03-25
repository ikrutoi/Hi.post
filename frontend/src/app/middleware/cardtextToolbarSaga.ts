import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setComplete,
  setApplied,
  setAppliedData,
  setFavorite,
  loadCardtextTemplatesRequest,
  updateCardtextTemplateFavoriteInList,
  updateCardtextTemplateContentInList,
} from '@cardtext/infrastructure/state'
import { changeFontSizeStep } from './cardtextHandlers'
import type { RootState } from '@app/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  setCardtextFocusRequested,
  setCardtextCurrentView,
  setCardtextAssetId,
  toggleCardtextListSortDirection,
  setValue,
  restoreCreateDraft,
  setCreateReturnSnapshot,
} from '@cardtext/infrastructure/state'
import { initialCardtextValue } from '@/features/cardtext/domain/editor/editor.types'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextShowViewMode,
  selectCardtextAssetId,
  selectCardtextFavorite,
  selectCardtextPlainText,
  selectCardtextLines,
  selectCardtextCreateDraft,
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
      const assetId: string | null = yield select(selectCardtextAssetId)
      const value: ReturnType<typeof selectCardtextValue> =
        yield select(selectCardtextValue)
      const style: ReturnType<typeof selectCardtextStyle> =
        yield select(selectCardtextStyle)
      yield put(setApplied(assetId ?? null))
      yield put(setAppliedData({ value: value ?? [], style }))
      yield put(setComplete(true))
      break
    }

    case 'edit':
      if (section === 'cardtextView') {
        yield put(setCardtextCurrentView('cardtextEditor'))
      } else if (section === 'cardtextEditor') {
        const assetId: string | null = yield select(selectCardtextAssetId)
        const value: ReturnType<typeof selectCardtextValue> =
          yield select(selectCardtextValue)
        const style: ReturnType<typeof selectCardtextStyle> =
          yield select(selectCardtextStyle)
        const plainText: string = yield select(selectCardtextPlainText)
        const cardtextLines: number = yield select(selectCardtextLines)

        // If we are editing an existing template, persist changes on exit
        if (assetId) {
          const result = yield call(
            templateService.updateCardtextTemplate,
            assetId,
            { value, style, plainText, cardtextLines },
          )
          if (result?.success) {
            yield put(
              updateCardtextTemplateContentInList({
                id: assetId,
                value: value ?? [],
                style,
                plainText,
                cardtextLines,
              }),
            )
          }
        }

        yield put(setApplied(assetId ?? null))
        yield put(setAppliedData({ value: value ?? [], style }))
        yield put(setComplete(true))
        yield put(setCardtextCurrentView('cardtextView'))
      }
      break

    case 'favorite':
      if (section === 'cardtextView') {
        const assetId: string | null = yield select(selectCardtextAssetId)
        if (!assetId) break
        const favorite: boolean = yield select(selectCardtextFavorite)
        const next = !favorite
        const result = yield call(
          templateService.updateCardtextTemplate,
          assetId,
          { favorite: next },
        )
        if (result?.success) {
          yield put(setFavorite(next))
          yield put(
            updateCardtextTemplateFavoriteInList({
              id: assetId,
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
        const snapshot: ReturnType<typeof selectCardtextSessionData> =
          yield select(selectCardtextSessionData)
        yield put(setCreateReturnSnapshot(snapshot))
        const draft: ReturnType<typeof selectCardtextCreateDraft> =
          yield select(selectCardtextCreateDraft)
        if (draft) {
          yield put(restoreCreateDraft(draft))
        } else {
          yield put(setValue(initialCardtextValue as any))
        }
        yield put(setCardtextAssetId(null))
        yield put(setCardtextCurrentView('cardtextEditor'))
        yield put(setCardtextFocusRequested(true))
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
        yield put(setCardtextFocusRequested(true))
      }
      break
    }
  }
}
