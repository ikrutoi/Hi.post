import { SagaIterator } from 'redux-saga'
import { all, call, takeLatest, select, put } from 'redux-saga/effects'
import { handleEditorPieToolbarAction } from './editorPieToolbarSaga'
import { toolbarAction } from '@/features/toolbar/application/helpers'
import {
  clearSection,
  requestRainbowStop,
  resetEditor,
  setSectionComplete,
  startRainbow,
} from '@entities/cardEditor/infrastructure/state'
import { selectPieProgress } from '@/entities/cardEditor/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'

function* handleRainbowLogic() {
  const { sections, isAllComplete, isRainbowActive } = yield select(
    selectPieProgress,
  )

  if (isAllComplete && !isRainbowActive) {
    yield put(startRainbow())
  } else if (!isAllComplete && isRainbowActive) {
    yield put(requestRainbowStop())
  }

  const allRequiredComplete =
    sections.cardphoto && sections.cardtext && sections.envelope && sections.aroma

  yield put(
    updateToolbarSection({
      section: 'editorPie',
      value: {
        favorite: allRequiredComplete ? 'enabled' : 'disabled',
      },
    }),
  )
}

export function* editorPieProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleEditorPieToolbarAction),

    takeLatest(
      [setSectionComplete.type, clearSection.type, resetEditor.type],
      handleRainbowLogic,
    ),
    // fork(watchFontSizeChanges),
    // fork(watchCardphotoOrientation),
  ])
}
