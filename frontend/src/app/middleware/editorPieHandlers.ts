import { put } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  setHoveredSection,
} from '@entities/cardEditor/infrastructure/state'
import { clearDate } from '@date/infrastructure/state'
import { clear as clearAroma } from '@aroma/infrastructure/state'
import { setSenderApplied } from '@envelope/sender/infrastructure/state'
import {
  clearRecipientViewDraft,
  setRecipientApplied,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientsViewIdsSecondList,
} from '@envelope/recipient/infrastructure/state'
import {
  clearRecipientsPending,
  closeAddressEditSession,
  setAddressFormView,
  setRecipientsList,
} from '@envelope/infrastructure/state'
import { setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'
import { clearText } from '@cardtext/infrastructure/state'
import { resetEditor } from '@entities/cardEditor/infrastructure/state'

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
  yield put(setCardtextAppliedData(null))
  yield put(clearApply())
}

/** Сброс UI получателей конверта — иначе остаётся viewDraft / ids и при открытии Envelope виден старый адрес. */
function* resetEnvelopeRecipientUiAfterWorkspaceClear(): SagaIterator {
  yield put(clearRecipientViewDraft())
  yield put(setRecipientViewId(null))
  yield put(setRecipientView('recipientsView'))
  yield put(setRecipientsViewIds([]))
  yield put(setRecipientsViewIdsSecondList([]))
  yield put(setRecipientsList([]))
  yield put(clearRecipientsPending())
  yield put(closeAddressEditSession({ role: 'recipient' }))
  yield put(setAddressFormView({ show: false, role: null }))
}

/** Card pie: единственная строка ушла в корзину — пустой редактор и placeholder в списке. */
export function* clearCardPieWorkspaceAfterCartAdd(): SagaIterator {
  yield* handleClearAllMiniSectionsAction()
  yield* resetEnvelopeRecipientUiAfterWorkspaceClear()
  yield put(clearText())
  yield put(resetEditor())
}
