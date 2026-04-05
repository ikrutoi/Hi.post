import { put } from 'redux-saga/effects'
import { reset } from '@cardphoto/infrastructure/state'
import { clearSender } from '@envelope/sender/infrastructure/state'
import { clearRecipient } from '@envelope/recipient/infrastructure/state'
import { clearText } from '@cardtext/infrastructure/state'
import { clearAroma } from '@entities/aroma/infrastructure/state/aroma.slice'
import { clearDate } from '@date/infrastructure/state'
import { PayloadAction } from '@reduxjs/toolkit'
import { CardSection } from '@shared/config/constants'
import { checkAndSyncProcessedCard } from './syncProcessedCard'

export { checkAndSyncProcessedCard }

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
    yield put(reset())
  }
  if (section === 'all' || section === 'envelope') {
    yield put(clearSender())
    yield put(clearRecipient())
  }
}
