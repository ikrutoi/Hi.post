import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { postcardsAdapter, storeAdapters } from '@db/adapters/storeAdapters'
import { addItem } from '@cart/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import {
  selectMergedDispatchDates,
  selectIsMultiDateMode,
} from '@date/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { DispatchDate } from '@entities/date'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { CardStatus, Postcard } from '@entities/postcard'
import type { SessionData } from '@entities/db/domain/types'

type CreateTarget = 'favorite' | 'cart'

function* setSessionFavoritePostcardLocalId(
  favoritePostcardLocalId: number | null,
): SagaIterator {
  const currentSession: SessionData | null = yield call(
    [storeAdapters.session, 'getById'],
    'current_session',
  )
  if (!currentSession) return
  yield call([storeAdapters.session, 'put'], {
    ...currentSession,
    favoritePostcardLocalId,
  })
}

function buildBaseCard(opts: {
  id: string
  thumbnailUrl: string
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeSessionRecord
  aroma: AromaItem
  date: DispatchDate | null
}) {
  const { id, thumbnailUrl, cardphoto, cardtext, envelope, aroma, date } = opts
  // Favorite snapshot is intentionally date-less; Date is required in Card type.
  return {
    id,
    thumbnailUrl,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
  } as unknown as Postcard['card']
}

function buildPostcardFingerprint(input: {
  status: CardStatus
  card: Postcard['card']
}): string {
  const { status, card } = input
  const cardphoto = card.cardphoto as Partial<CardphotoState> | undefined
  const cardtext = card.cardtext as Partial<CardtextState> | undefined
  const envelope = card.envelope as Partial<EnvelopeSessionRecord> | undefined
  const aroma = card.aroma as Partial<AromaItem> | undefined

  const appliedData = cardphoto?.appliedData as
    | {
        id?: string
        previewUrl?: string
        thumbnail?: { url?: string } | null
      }
    | null
    | undefined

  return JSON.stringify({
    status,
    // Keep only stable domain-significant payload (reload-safe).
    card: {
      thumbnailUrl: card.thumbnailUrl ?? '',
      date: card.date ?? null,
      cardphoto: {
        appliedId: appliedData?.id ?? null,
        appliedPreviewUrl: appliedData?.previewUrl ?? null,
        appliedThumbUrl: appliedData?.thumbnail?.url ?? null,
      },
      cardtext: {
        id: cardtext?.id ?? null,
        status: cardtext?.status ?? null,
        value: cardtext?.value ?? null,
        style: cardtext?.style ?? null,
      },
      envelope: {
        sender: envelope?.sender ?? null,
        recipient: envelope?.recipient ?? null,
      },
      aroma: {
        index: aroma?.index ?? null,
      },
    },
  })
}

export function* createPostcardsFromEditor(target: CreateTarget): SagaIterator {
  const cardphoto: CardphotoState = yield select(selectCardphotoState)
  const cardtext: CardtextState = yield select(selectCardtextState)
  const envelope: EnvelopeSessionRecord = yield select(
    selectEnvelopeSessionRecord,
  )
  const mergedDates: DispatchDate[] = yield select(selectMergedDispatchDates)
  const isMultiDateMode: boolean = yield select(selectIsMultiDateMode)
  const aroma: AromaItem = yield select(selectSelectedAroma)

  const appliedPhoto = cardphoto.appliedData
  if (!appliedPhoto) return

  const status: CardStatus = target === 'favorite' ? 'favorite' : 'cart'
  const dates: Array<DispatchDate | null> =
    target === 'favorite'
      ? [null]
      : isMultiDateMode && mergedDates.length > 1
        ? mergedDates
        : mergedDates.slice(0, 1)
  if (dates.length === 0) return

  const existingRows: Postcard[] = yield call([postcardsAdapter, 'getAll'])
  const existingFingerprints = new Set(
    existingRows.map((row) =>
      buildPostcardFingerprint({
        status: row.status,
        card: row.card,
      }),
    ),
  )

  let maxLocalId: number = yield call([postcardsAdapter, 'getMaxLocalId'])
  const now = Date.now()

  for (const date of dates) {
    const candidateCard = buildBaseCard({
      id: `${appliedPhoto.id}__candidate`,
      thumbnailUrl: appliedPhoto.thumbnail?.url ?? '',
      cardphoto,
      cardtext,
      envelope,
      aroma,
      date,
    })
    const fingerprint = buildPostcardFingerprint({
      status,
      card: candidateCard,
    })
    if (existingFingerprints.has(fingerprint)) {
      if (status === 'favorite') {
        const existingFavorite = existingRows.find(
          (row) =>
            row.status === 'favorite' &&
            buildPostcardFingerprint({ status: row.status, card: row.card }) ===
              fingerprint,
        )
        if (existingFavorite) {
          yield call(setSessionFavoritePostcardLocalId, existingFavorite.localId)
        }
      }
      continue
    }

    maxLocalId += 1
    const localId = maxLocalId
    const postcard: Postcard = {
      localId,
      price: '',
      createdAt: now,
      updatedAt: now,
      status,
      card: {
        ...candidateCard,
        id: `${appliedPhoto.id}__${localId}`,
      },
    }
    yield call([postcardsAdapter, 'addRecordWithId'], localId, postcard)
    existingFingerprints.add(fingerprint)
    if (status === 'favorite') {
      yield call(setSessionFavoritePostcardLocalId, localId)
    }
    if (status === 'cart') {
      yield put(addItem(postcard))
    }
  }

  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* removeFavoritePostcardsFromEditor(): SagaIterator {
  const currentSession: SessionData | null = yield call(
    [storeAdapters.session, 'getById'],
    'current_session',
  )
  const favoriteId = currentSession?.favoritePostcardLocalId ?? null
  if (favoriteId != null) {
    // In canonical postcards store keyPath is `id`; for these rows it matches localId.
    yield call([postcardsAdapter, 'deleteById'], favoriteId)
  }
  yield call(setSessionFavoritePostcardLocalId, null)

  yield call(refreshRightSidebarBadgesFromPostcards)
}

export function* refreshRightSidebarBadgesFromPostcards(): SagaIterator {
  const allRows: Postcard[] = yield call([postcardsAdapter, 'getAll'])
  const cartCount = allRows.filter((row) => row.status === 'cart').length
  const favoriteCount = allRows.filter((row) => row.status === 'favorite').length
  yield put(
    updateToolbarSection({
      section: 'rightSidebar',
      value: {
        cart: { options: { badge: cartCount > 0 ? cartCount : null } },
        favorite: { options: { badge: favoriteCount > 0 ? favoriteCount : null } },
      },
    }),
  )
}

function* handleAddCartToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { key } = action.payload
  if (key !== 'addCart') return
  yield call(createPostcardsFromEditor, 'cart')
}

export function* postcardCreateSaga(): SagaIterator {
  yield takeLatest(toolbarAction.type, handleAddCartToolbarAction)
}
