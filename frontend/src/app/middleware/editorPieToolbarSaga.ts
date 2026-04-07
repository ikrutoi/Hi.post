import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { togglePieFavorite } from '@entities/cardEditor/infrastructure/state'
import type { RootState } from '@app/state'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import {
  handleAddDraftsAction,
  handleClearAllMiniSectionsAction,
} from './editorPieHandlers'
import { EditorPieKey, ToolbarSection } from '@/features/toolbar/domain/types'
import {
  createPostcardsFromEditor,
  removeFavoritePostcardsFromEditor,
} from './postcardCreateSaga'

export function* handleEditorPieToolbarAction(
  action: PayloadAction<{ section: ToolbarSection; key: EditorPieKey }>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'editorPie') return
  switch (key) {
    case 'addCart': {
      const { isAllComplete } = yield select(selectPieProgress)
      if (!isAllComplete) break
      yield call(createPostcardsFromEditor, 'cart')
      break
    }

    case 'addDrafts':
      yield call(handleAddDraftsAction)
      break

    case 'close':
      yield call(handleClearAllMiniSectionsAction)
      break

    case 'favorite': {
      const { sections } = yield select(selectPieProgress)
      const canToggle =
        sections.cardphoto &&
        sections.cardtext &&
        sections.envelope &&
        sections.aroma
      if (!canToggle) break
      const pieFavorite: boolean = yield select(
        (s: RootState) => s.cardEditor.pieFavorite,
      )
      if (!pieFavorite) {
        yield call(createPostcardsFromEditor, 'favorite')
      } else {
        yield call(removeFavoritePostcardsFromEditor)
      }
      yield put(togglePieFavorite())
      break
    }
  }
}
