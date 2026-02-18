import { SagaIterator } from 'redux-saga'
import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import {
  setSectionComplete,
  clearSection,
} from '@entities/cardEditor/infrastructure/state'
import { setDate, clearDate } from '@date/infrastructure/state'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  updateRecipientField,
  restoreRecipient,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { selectIsDateComplete } from '@date/infrastructure/selectors'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import { setValue, clearText } from '@cardtext/infrastructure/state'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { applyFinal } from '@cardphoto/infrastructure/state'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import {
  changeStatus,
  syncProcessedRequest,
} from '@entities/card/infrastructure/state'
import type { CardSection } from '@shared/config/constants'
import {
  checkAndSyncProcessedCard,
  handleClearSectionSaga,
} from './cardEditorProcessor'

function* syncSectionStatus(section: CardSection) {
  const selectorsMap = {
    date: selectIsDateComplete,
    aroma: selectIsAromaComplete,
    envelope: selectIsEnvelopeReady,
    cardtext: selectCardtextIsComplete,
    cardphoto: selectCardphotoIsComplete,
  }

  const isComplete: boolean = yield select(selectorsMap[section])
  yield put(setSectionComplete({ section, isComplete }))

  yield fork(handleSectionChange)
}

export function* cardEditorSaga(): SagaIterator {
  yield all([
    takeEvery([setDate.type, clearDate.type], () => syncSectionStatus('date')),
    takeEvery([setAroma.type, clearAroma.type], () =>
      syncSectionStatus('aroma'),
    ),
    takeEvery(
      [
        updateSenderField.type,
        updateRecipientField.type,
        setEnabled.type,
        clearSender.type,
      ],
      () => syncSectionStatus('envelope'),
    ),
    takeEvery([setValue.type, clearText.type], () =>
      syncSectionStatus('cardtext'),
    ),
    takeEvery([applyFinal.type], () => syncSectionStatus('cardphoto')),

    takeEvery(syncProcessedRequest.type, checkAndSyncProcessedCard),
    // takeEvery(changeStatus.type, handleStatusToDrafts),

    takeEvery(clearSection.type, handleClearSectionSaga),
  ])
}
