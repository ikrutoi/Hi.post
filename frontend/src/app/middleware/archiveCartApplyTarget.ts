import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import type { ImageMeta } from '@cardphoto/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { clearCalendarPreviewCache } from '@entities/card/infrastructure/state'
import { setAsset } from '@/entities/assetRegistry/infrastructure/state'
import { postcardRefsFromCard, type PostcardHydrated } from '@entities/postcard'
import type { CardPanelSection } from '@cardPanel/domain/types'
import { selectCartItems, selectCartListSelectedLocalId } from '@cart/infrastructure/selectors'
import { updateItem } from '@cart/infrastructure/state'
import { selectHistoryListSelectedLocalId } from '@date/calendar/infrastructure/selectors'
import { selectMirrorSectionBackup } from '@cardPanel/infrastructure/selectors/mirrorSectionBackupSelectors'
import { clearMirrorSectionBackup } from '@cardPanel/infrastructure/state/mirrorSectionBackup.slice'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'
import { prepareForRedux } from './cardphotoHelpers'
import { restoreMirrorSectionBackup } from './mirrorSectionBackup.helpers'

function durableCardphotoUrl(meta: ImageMeta): string {
  for (const url of [meta.thumbnail?.url, meta.full?.url, meta.url]) {
    if (typeof url === 'string' && url.trim() !== '' && !url.startsWith('blob:')) {
      return url.trim()
    }
  }
  return ''
}

/**
 * Apply в режиме корзина/история для открытки cart / cartBlocked.
 * Только эта открытка. Сессия фабрики сюда не входит.
 */
export function* readArchiveCartApplyPostcard(): SagaIterator<PostcardHydrated | null> {
  const retainedStrip: 'cart' | 'cartdate' | 'history' | null = yield select(
    (s: RootState) => s.cardPanel.archiveEditRetainsStrip,
  )
  if (
    retainedStrip !== 'cart' &&
    retainedStrip !== 'cartdate' &&
    retainedStrip !== 'history'
  ) {
    return null
  }

  const cartSelected: number | null = yield select(selectCartListSelectedLocalId)
  const historySelected: number | null = yield select(
    selectHistoryListSelectedLocalId,
  )
  const localId = cartSelected ?? historySelected
  if (localId == null) return null

  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((item) => item.localId === localId) ?? null
  if (postcard == null) return null
  if (postcard.status !== 'cart' && postcard.status !== 'cartBlocked') {
    return null
  }
  return postcard
}

/**
 * Новое фото открытки корзины: пай, центральная секция и строка списка
 * читают разные поля. Обновляем applied, thumbnail и сбрасываем кэш превью.
 */
export function* commitArchiveCartCardphoto(
  postcard: PostcardHydrated,
  meta: ImageMeta,
): SagaIterator {
  const serializable = prepareForRedux(meta) as ImageMeta
  if (serializable.id) {
    const url = serializable.url || serializable.thumbnail?.url || ''
    const thumbUrl = serializable.thumbnail?.url || serializable.url || ''
    if (url || thumbUrl) {
      yield put(
        setAsset({
          id: serializable.id,
          url: url || thumbUrl,
          thumbUrl: thumbUrl || url,
        }),
      )
    }
  }
  const nextCard = {
    ...postcard.card,
    thumbnailUrl: durableCardphotoUrl(serializable),
    cardphoto: {
      ...postcard.card.cardphoto,
      appliedData: serializable,
      assetData: serializable,
    },
  }
  const nextPostcard: PostcardHydrated = {
    ...postcard,
    updatedAt: Date.now(),
    postcard: postcardRefsFromCard(nextCard),
    card: nextCard,
  }
  try {
    yield call([storeAdapters.postcards, 'put'], nextPostcard)
  } catch (e) {
    console.error('commitArchiveCartCardphoto: persist failed', e)
  }
  yield put(updateItem(nextPostcard))
  yield put(postcardLocalDataChanged())
  yield put(clearCalendarPreviewCache(nextCard.id))
}

/** Вернуть секцию сборки из снимка, сделанного до правки архива. */
export function* restoreFactorySectionBackup(
  section: CardPanelSection,
): SagaIterator {
  const backup = yield select((s: RootState) =>
    selectMirrorSectionBackup(s, section),
  )
  if (backup == null) return
  yield call(restoreMirrorSectionBackup, backup)
  yield put(clearMirrorSectionBackup(section))
}
