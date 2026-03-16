import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setComplete,
  setApplied,
  setAppliedData,
  setFavorite,
  updateCardtextTemplateFavoriteInList,
} from '@cardtext/infrastructure/state'
import { changeFontSizeStep } from './cardtextHandlers'
import type { RootState } from '@app/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  setCardtextFocusRequested,
  setCardtextCurrentView,
  toggleCardtextListSortDirection,
  clearText,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextShowViewMode,
  selectCardtextAssetId,
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

  const isCardtextSection = section === 'cardtext' || section === 'cardtextView'
  if (!isCardtextSection) return

  switch (key) {
    case 'apply': {
      const assetId: string | null = yield select(selectCardtextAssetId)
      const value: ReturnType<typeof selectCardtextValue> = yield select(
        selectCardtextValue,
      )
      const style: ReturnType<typeof selectCardtextStyle> = yield select(
        selectCardtextStyle,
      )
      yield put(setApplied(assetId ?? null))
      yield put(setAppliedData({ value: value ?? [], style }))
      yield put(setComplete(true))
      break
    }

    case 'edit':
      if (section === 'cardtextView') {
        yield put(setCardtextCurrentView('cardtextEditor'))
      }
      break

    case 'favorite':
      if (section === 'cardtextView') {
        const assetId: string | null = yield select(selectCardtextAssetId)
        if (!assetId) break
        const favorite: boolean | null = yield select(
          (s: RootState) => s.cardtext.favorite,
        )
        const next = favorite === true ? false : true
        const result = yield call(
          templateService.updateCardtextTemplate,
          assetId,
          { favorite: next },
        )
        if (result?.success) {
          yield put(setFavorite(next))
          yield put(updateCardtextTemplateFavoriteInList({ id: assetId, favorite: next }))
        }
      }
      break

    case 'fontSizeLess':
      if (section === 'cardtext') yield call(changeFontSizeStep, editor, 'less')
      break

    case 'fontSizeMore':
      if (section === 'cardtext') yield call(changeFontSizeStep, editor, 'more')
      break

    case 'listCardtext': {
      const current: any = (yield select(
        (state: RootState) => state.toolbar[section].listCardtext,
      )) as any
      const isActive =
        current?.state === 'active' || current === 'active'
      const nextState = isActive ? 'enabled' : 'active'

      yield put(
        updateToolbarIcon({
          section,
          key: 'listCardtext',
          value: nextState,
        }),
      )
      yield put(setCardtextListPanelOpen(!isActive))
      break
    }

    case 'listAdd':
      yield put(setCardtextAddTemplateOpen(true))
      break

    case 'cardtextAdd': {
      if (section === 'cardtextView') {
        yield put(clearText())
        yield put(setCardtextCurrentView('cardtextEditor'))
        yield put(setCardtextFocusRequested(true))
        break
      }
      const value: any = yield select(selectCardtextValue)
      const showViewMode: boolean = yield select(selectCardtextShowViewMode)
      const isEmpty =
        !showViewMode &&
        (!value?.length ||
          (value.length === 1 &&
            !(value[0]?.children?.map((c: any) => c?.text).join('') ?? '').trim()))
      if (isEmpty) {
        yield put(setCardtextFocusRequested(true))
      }
      break
    }
  }
}
