import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  closeAromaPreview,
  openAromaPreview,
  setAroma,
  stepAromaPreview,
} from '@aroma/infrastructure/state'
import {
  selectAromaPreviewIndex,
  selectAromaPreviewOpen,
} from '@aroma/infrastructure/selectors'

const AROMA_PREVIEW_TOOLBAR_ENABLED = {
  apply: { state: 'enabled' as const },
  chevronLeft: { state: 'enabled' as const },
  chevronRight: { state: 'enabled' as const },
  close: { state: 'enabled' as const },
}

const AROMA_PREVIEW_TOOLBAR_DISABLED = {
  apply: { state: 'disabled' as const },
  chevronLeft: { state: 'disabled' as const },
  chevronRight: { state: 'disabled' as const },
  close: { state: 'disabled' as const },
}

function* syncAromaToolbarState(): SagaIterator {
  const previewOpen: boolean = yield select(selectAromaPreviewOpen)
  yield put(
    updateToolbarSection({
      section: 'aroma',
      value: previewOpen
        ? AROMA_PREVIEW_TOOLBAR_ENABLED
        : AROMA_PREVIEW_TOOLBAR_DISABLED,
    }),
  )
}

function* handleAromaToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'aroma') return

  const previewOpen: boolean = yield select(selectAromaPreviewOpen)
  if (!previewOpen) return

  switch (key) {
    case 'close':
      yield put(closeAromaPreview())
      break
    case 'apply': {
      const previewIndex: ReturnType<typeof selectAromaPreviewIndex> =
        yield select(selectAromaPreviewIndex)
      if (previewIndex == null) return
      yield put(setAroma({ index: previewIndex }))
      yield put(closeAromaPreview())
      break
    }
    case 'chevronLeft':
      yield put(stepAromaPreview(-1))
      break
    case 'chevronRight':
      yield put(stepAromaPreview(1))
      break
    default:
      break
  }
}

function* watchAromaToolbar(): SagaIterator {
  yield takeEvery(toolbarAction.type, handleAromaToolbarAction)
  yield takeEvery(
    [openAromaPreview.type, closeAromaPreview.type, stepAromaPreview.type],
    syncAromaToolbarState,
  )
}

export function* aromaToolbarSaga(): SagaIterator {
  yield fork(syncAromaToolbarState)
  yield all([fork(watchAromaToolbar)])
}
