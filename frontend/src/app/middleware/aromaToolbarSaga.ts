import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'
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
import { selectViewAroma } from '@aroma/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { setCartItemCardAroma, updateItem } from '@cart/infrastructure/state'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { postcardRefsFromCard, type PostcardHydrated } from '@entities/postcard'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'
import {
  readArchiveCartApplyPostcard,
  restoreFactorySectionBackup,
} from './archiveCartApplyTarget'

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

  const archivePostcard = yield call(readArchiveCartApplyPostcard)
  if (archivePostcard != null) {
    yield put(
      setCartItemCardAroma({
        localId: archivePostcard.localId,
        aroma: viewAroma,
      }),
    )
    yield call(restoreFactorySectionBackup, 'aroma')
    return
  }

  yield put(setAroma(viewAroma))
}

/** Apply и клик по плитке меняют аромат открытки. Строка должна попасть в IDB, иначе pull вернёт старую картинку. */
function* persistCartItemAroma(
  action: ReturnType<typeof setCartItemCardAroma>,
): SagaIterator {
  const { localId, aroma } = action.payload
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((item) => item.localId === localId)
  if (postcard?.id == null) return

  const nextCard = {
    ...postcard.card,
    aroma: { ...aroma },
  }
  const nextPostcard: PostcardHydrated = {
    ...postcard,
    updatedAt: Date.now(),
    postcard: postcardRefsFromCard(nextCard),
    card: nextCard,
  }
  try {
    yield call([postcardsAdapter, 'put'], nextPostcard)
  } catch (e) {
    console.error('persistCartItemAroma: persist failed', e)
  }
  yield put(updateItem(nextPostcard))
  yield put(postcardLocalDataChanged())
}

function* watchAromaToolbar(): SagaIterator {
  yield takeEvery(toolbarAction.type, handleAromaToolbarAction)
  yield takeEvery(setCartItemCardAroma.type, persistCartItemAroma)
  yield takeEvery(
    [setViewAroma.type, clearViewAroma.type, setAroma.type, clearAroma.type, clearApplied.type],
    syncAromaToolbarState,
  )
}

export function* aromaToolbarSaga(): SagaIterator {
  yield fork(syncAromaToolbarState)
  yield all([fork(watchAromaToolbar)])
}
