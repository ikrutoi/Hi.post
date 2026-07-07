import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  setViewAroma,
  setAroma,
  clear as clearAroma,
  clearApplied,
  clearViewAroma,
} from '@aroma/infrastructure/state'
import {
  selectViewAroma,
  selectSelectedAroma,
  selectAromaApplyMatches,
} from '@aroma/infrastructure/selectors'

function* syncAromaToolbarState(): SagaIterator {
  const viewAroma: ReturnType<typeof selectViewAroma> =
    yield select(selectViewAroma)
  const applyMatches: boolean = yield select(selectAromaApplyMatches)

  yield put(
    updateToolbarSection({
      section: 'aroma',
      value: {
        apply: {
          state: !viewAroma
            ? ('disabled' as const)
            : applyMatches
              ? ('active' as const)
              : ('enabled' as const),
        },
        return: {
          state: viewAroma ? ('enabled' as const) : ('disabled' as const),
        },
      },
    }),
  )
}

function* handleAromaToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'aroma') return

  if (key === 'return') {
    const viewAroma: ReturnType<typeof selectViewAroma> =
      yield select(selectViewAroma)
    if (viewAroma) {
      yield put(clearViewAroma())
    }
    return
  }

  if (key !== 'apply') return

  const viewAroma: ReturnType<typeof selectViewAroma> =
    yield select(selectViewAroma)
  const applyMatches: boolean = yield select(selectAromaApplyMatches)

  if (applyMatches) {
    yield put(clearApplied())
    return
  }

  if (viewAroma) {
    yield put(setAroma(viewAroma))
  }
}

function* watchAromaToolbar(): SagaIterator {
  yield takeEvery(toolbarAction.type, handleAromaToolbarAction)
  yield takeEvery(
    [setViewAroma.type, clearViewAroma.type, setAroma.type, clearAroma.type, clearApplied.type],
    syncAromaToolbarState,
  )
}

export function* aromaToolbarSaga(): SagaIterator {
  yield fork(syncAromaToolbarState)
  yield all([fork(watchAromaToolbar)])
}
