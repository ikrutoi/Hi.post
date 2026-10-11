import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  setCartListSelectedLocalId,
  setCartListStatusSegment,
  updateItem,
} from '@cart/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { cartCalendarDatePickApplied } from '@date/calendar/application/orchestration/notebookOrchestration.events'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import type { PostcardHydrated } from '@entities/postcard'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

function* handleCartCalendarDatePickApplied(
  action: ReturnType<typeof cartCalendarDatePickApplied>,
): SagaIterator {
  const { localId, date } = action.payload

  const items: PostcardHydrated[] = yield select(selectCartItems)
  const target = items.find((p) => p.localId === localId)

  if (target) {
    const now = Date.now()
    /** `card.date` и `postcard.date` держим синхронно: правый CardPie / превью читают `card.date`. */
    const next: PostcardHydrated = {
      ...target,
      date: { ...date },
      updatedAt: now,
      card: { ...target.card, date: { ...date } },
    }

    try {
      yield call(postcardsAdapter.put, next)
    } catch (e) {
      console.error('cartCalendarDatePickApplied: persist failed', e)
    }

    /** `updateItem` нормализует `cart`/`cartBlocked` по дате (см. `cartSlice`). */
    yield put(updateItem(next))
    /** Бэйдж иконки `cart` правого сайдбара пересчитывается из IDB. */
    yield call(refreshRightSidebarBadgesFromPostcards)
    yield put(postcardLocalDataChanged())
  }

  /**
   * Актуальная дата → сегмент «Корзина» и выбор этой строки.
   * Режим pick не выключаем: при cardPieEdit / dateEdit можно сразу
   * выбрать другую дату. Сброс — при выходе из edit.
   */
  const itemsAfter: PostcardHydrated[] = yield select(selectCartItems)
  const updated = itemsAfter.find((p) => p.localId === localId)
  if (updated?.status === 'cart') {
    yield put(setCartListStatusSegment('cart'))
    yield put(setCartListSelectedLocalId(localId))
  }
}

export function* watchCartCalendarDatePick(): SagaIterator {
  yield takeEvery(
    cartCalendarDatePickApplied.type,
    handleCartCalendarDatePickApplied,
  )
}
