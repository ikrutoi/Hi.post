import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { RootState } from '@app/state'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  setViewAroma,
  setAroma,
  clear as clearAroma,
  clearApplied,
  clearViewAroma,
} from '@aroma/infrastructure/state'
import { selectViewAroma } from '@aroma/infrastructure/selectors'
import { setCartItemCardAroma } from '@cart/infrastructure/state'
import { selectCartListSelectedLocalId } from '@cart/infrastructure/selectors'
import { selectHistoryListSelectedLocalId } from '@date/calendar/infrastructure/selectors'

function* syncAromaToolbarState(): SagaIterator {
  const viewAroma: ReturnType<typeof selectViewAroma> =
    yield select(selectViewAroma)

  yield put(
    updateToolbarSection({
      section: 'aroma',
      value: {
        apply: {
          /** Enabled только пока в центральном CardPie показано превью ячейки. */
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

  if (key !== 'apply') return

  const viewAroma: ReturnType<typeof selectViewAroma> =
    yield select(selectViewAroma)
  if (!viewAroma) return

  yield put(setAroma(viewAroma))

  /**
   * Archive edit: same Apply as left, then write aroma onto the selected
   * cart/history postcard (was previously an instant tile→cart write).
   */
  const archiveEditActive: boolean = yield select(
    (s: RootState) => s.cardPanel?.archiveFactoryEditActive === true,
  )
  if (!archiveEditActive) return

  const cartLocalId: number | null = yield select(selectCartListSelectedLocalId)
  const historyLocalId: number | null = yield select(
    selectHistoryListSelectedLocalId,
  )
  const localId = cartLocalId ?? historyLocalId
  if (localId == null) return

  yield put(
    setCartItemCardAroma({
      localId,
      aroma: viewAroma,
    }),
  )
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
