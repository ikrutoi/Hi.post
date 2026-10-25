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
import { dispatchPriceLineForDate } from '@date/domain/dispatchPriceTable'
import type { PostcardHydrated } from '@entities/postcard'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'
import { flushPendingV2Sync } from '@features/sync/infrastructure/postcardV2PendingSync'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

function* handleCartCalendarDatePickApplied(
  action: ReturnType<typeof cartCalendarDatePickApplied>,
): SagaIterator {
  const { localId, date } = action.payload

  const items: PostcardHydrated[] = yield select(selectCartItems)
  const target = items.find((p) => p.localId === localId)

  if (target) {
    const now = Date.now()
    /**
     * `card.date` и `postcard.date` — одна новая дата.
     * Старый `card.dates` снимаем, иначе список истории сортирует по нему.
     */
    const card = { ...target.card, date: { ...date } }
    delete (card as { dates?: unknown }).dates
    const next: PostcardHydrated = {
      ...target,
      date: { ...date },
      price: dispatchPriceLineForDate(date),
      updatedAt: now,
      card,
    }

    /**
     * Сразу в Redux: упрощённый CardPie после Apply читает `postcard.date`.
     * Запись в IDB и облако идёт следом и не должна мигать старой датой.
     */
    yield put(updateItem(next))

    try {
      yield call(postcardsAdapter.put, next)
      yield call(flushPendingV2Sync)
    } catch (e) {
      console.error('cartCalendarDatePickApplied: persist failed', e)
    }

    /** Бэйдж иконки `cart` правого сайдбара пересчитывается из IDB. */
    yield call(refreshRightSidebarBadgesFromPostcards)
    yield put(postcardLocalDataChanged())
  }

  /**
   * Актуальная дата → сегмент «Корзина»; просроченная остаётся в
   * «Заблокированных». Строку не теряем. Режим pick не выключаем здесь:
   * сброс — при выходе из edit.
   */
  const itemsAfter: PostcardHydrated[] = yield select(selectCartItems)
  const updated = itemsAfter.find((p) => p.localId === localId)
  if (updated?.status === 'cart' || updated?.status === 'cartBlocked') {
    yield put(setCartListStatusSegment(updated.status))
    yield put(setCartListSelectedLocalId(localId))
  }
}

export function* watchCartCalendarDatePick(): SagaIterator {
  yield takeEvery(
    cartCalendarDatePickApplied.type,
    handleCartCalendarDatePickApplied,
  )
}
