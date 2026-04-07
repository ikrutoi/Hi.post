import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { addItem } from '@cart/infrastructure/state'
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

type CreateTarget = 'favorite' | 'cart'

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
  return JSON.stringify({
    status,
    // Keep only domain-significant payload, without record ids/timestamps.
    card: {
      thumbnailUrl: card.thumbnailUrl ?? '',
      date: card.date ?? null,
      cardphoto: card.cardphoto ?? null,
      cardtext: card.cardtext ?? null,
      envelope: card.envelope ?? null,
      aroma: card.aroma ?? null,
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
    if (existingFingerprints.has(fingerprint)) continue

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
    if (status === 'cart') {
      yield put(addItem(postcard))
    }
  }
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
