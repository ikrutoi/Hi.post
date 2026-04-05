import { put } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  setHoveredSection,
  setPieFavorite,
} from '@entities/cardEditor/infrastructure/state'
import { clearDate } from '@date/infrastructure/state'
import { clear as clearAroma } from '@aroma/infrastructure/state'
import { setSenderApplied } from '@envelope/sender/infrastructure/state'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'

export function handleAddDraftsAction() {
  console.log('handleAddDrafts')
}

/** Same effect as clearing each mini section via `useCardEditorFacade().removeSection`. */
export function* handleClearAllMiniSectionsAction(): SagaIterator {
  yield put(setHoveredSection(null))
  yield put(setPieFavorite(false))
  yield put(clearDate())
  yield put(clearAroma())
  yield put(setSenderApplied(false))
  yield put(setRecipientApplied(false))
  yield put(setCardtextAppliedData(null))
  yield put(clearApply())
}
