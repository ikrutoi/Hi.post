import { put } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { setHoveredSection } from '@entities/cardEditor/infrastructure/state'
import { clearDate } from '@date/infrastructure/state'
import { clear as clearAroma } from '@aroma/infrastructure/state'
import { setSenderApplied } from '@envelope/sender/infrastructure/state'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { setStatus as setCardtextStatus } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'

export function handleAddDraftsAction() {
  console.log('handleAddDrafts')
}

/** Same effect as clearing each mini section via `useCardEditorFacade().removeSection`. */
export function* handleClearAllMiniSectionsAction(): SagaIterator {
  yield put(setHoveredSection(null))
  yield put(clearDate())
  yield put(clearAroma())
  yield put(setSenderApplied(false))
  yield put(setRecipientApplied(false))
  yield put(setCardtextStatus('inLine'))
  yield put(clearApply())
}
