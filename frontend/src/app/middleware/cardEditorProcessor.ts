import { takeEvery, put, select, call } from 'redux-saga/effects'
import { setProcessedCard } from '@entities/card/infrastructure/state'
import { clearSender } from '@envelope/sender/infrastructure/state'
import { clearRecipient } from '@envelope/recipient/infrastructure/state'
import { clearText } from '@cardtext/infrastructure/state'
import { clearAroma } from '@entities/aroma/infrastructure/state/aroma.slice'
import { clearDate } from '@date/infrastructure/state'
import { PayloadAction } from '@reduxjs/toolkit'
import { CardSection } from '@shared/config/constants'

export function* handleClearSectionSaga(
  action: PayloadAction<CardSection | 'all'>,
) {
  const section = action.payload

  if (section === 'all' || section === 'date') {
    yield put(clearDate())
  }
  if (section === 'all' || section === 'aroma') {
    yield put(clearAroma())
  }
  if (section === 'all' || section === 'cardtext') {
    yield put(clearText())
  }
  if (section === 'all' || section === 'cardphoto') {
    yield put(resetPhotoEditor())
  }
  if (section === 'all' || section === 'envelope') {
    yield put(clearSender())
    yield put(clearRecipient())
  }
}

export function* checkAndSyncProcessedCard() {
  const data: FullCardData = yield select(selectActiveCardFullData)

  if (!data.cardphoto.base.apply.image) return

  const processedCard: Card = {
    id: data.id,
    status: 'processed',
    thumbnailUrl: data.cardphoto.base.apply.image.thumbnail?.url || '',
    ...data,
    meta: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  }

  yield put(setProcessedCard(processedCard))
}
