import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  closeAromaPreview,
  openAromaPreview,
  setAroma,
  stepAromaPreview,
  clear as clearAroma,
} from '@aroma/infrastructure/state'
import {
  selectAromaPreviewIndex,
  selectAromaPreviewOpen,
  selectSelectedAroma,
} from '@aroma/infrastructure/selectors'

const AROMA_PREVIEW_TOOLBAR_NAV_ENABLED = {
  chevronLeft: { state: 'enabled' as const },
  chevronRight: { state: 'enabled' as const },
  return: { state: 'enabled' as const },
}

const AROMA_PREVIEW_TOOLBAR_DISABLED = {
  apply: { state: 'disabled' as const },
  chevronLeft: { state: 'disabled' as const },
  chevronRight: { state: 'disabled' as const },
  close: { state: 'disabled' as const },
  return: { state: 'disabled' as const },
}

function buildAromaPreviewToolbarState(
  previewIndex: ReturnType<typeof selectAromaPreviewIndex>,
  selectedAroma: ReturnType<typeof selectSelectedAroma>,
) {
  const applyMatchesSelection =
    previewIndex != null &&
    selectedAroma != null &&
    previewIndex === selectedAroma.index

  return {
    apply: {
      state: applyMatchesSelection ? ('active' as const) : ('enabled' as const),
    },
    ...AROMA_PREVIEW_TOOLBAR_NAV_ENABLED,
  }
}

function* syncAromaToolbarState(): SagaIterator {
  const previewOpen: boolean = yield select(selectAromaPreviewOpen)
  if (!previewOpen) {
    yield put(
      updateToolbarSection({
        section: 'aroma',
        value: AROMA_PREVIEW_TOOLBAR_DISABLED,
      }),
    )
    return
  }

  const previewIndex: ReturnType<typeof selectAromaPreviewIndex> = yield select(
    selectAromaPreviewIndex,
  )
  const selectedAroma: ReturnType<typeof selectSelectedAroma> =
    yield select(selectSelectedAroma)

  yield put(
    updateToolbarSection({
      section: 'aroma',
      value: buildAromaPreviewToolbarState(previewIndex, selectedAroma),
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
    case 'return':
      yield put(closeAromaPreview())
      break
    case 'apply': {
      const previewIndex: ReturnType<typeof selectAromaPreviewIndex> =
        yield select(selectAromaPreviewIndex)
      const selectedAroma: ReturnType<typeof selectSelectedAroma> =
        yield select(selectSelectedAroma)
      const applyMatchesSelection =
        previewIndex != null &&
        selectedAroma != null &&
        previewIndex === selectedAroma.index

      if (applyMatchesSelection) {
        yield put(clearAroma())
        break
      }

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
    [
      openAromaPreview.type,
      closeAromaPreview.type,
      stepAromaPreview.type,
      setAroma.type,
      clearAroma.type,
    ],
    syncAromaToolbarState,
  )
}

export function* aromaToolbarSaga(): SagaIterator {
  yield fork(syncAromaToolbarState)
  yield all([fork(watchAromaToolbar)])
}
