import { put } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  setHoveredSection,
} from '@entities/cardEditor/infrastructure/state'
import { clearDate } from '@date/infrastructure/state'
import { clear as clearAroma } from '@aroma/infrastructure/state'
import {
  clearSenderFormData,
  clearSenderViewDraft,
  setSenderApplied,
  setSenderView,
  setSenderViewId,
} from '@envelope/sender/infrastructure/state'
import {
  clearRecipientFormData,
  clearRecipientViewDraft,
  setCurrentRecipientsList,
  setRecipientApplied,
  setRecipientView,
  setRecipientViewId,
  setRecipientsViewIds,
  setRecipientsViewIdsSecondList,
} from '@envelope/recipient/infrastructure/state'
import {
  clearRecipientsPending,
  closeAddressEditSession,
  closeAddressList,
  setAddressFormView,
  setRecipientsList,
} from '@envelope/infrastructure/state'
import { setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'
import { clearText } from '@cardtext/infrastructure/state'
import { resetEditor } from '@entities/cardEditor/infrastructure/state'

export function handleAddDraftsAction() {}

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

/** Сброс UI конверта — иначе остаются viewDraft / view и при открытии Envelope видны старые адреса. */
function* resetEnvelopeSenderUiAfterWorkspaceClear(): SagaIterator {
  yield put(clearSenderViewDraft())
  yield put(clearSenderFormData())
  yield put(setSenderViewId(null))
  yield put(setSenderView('senderView'))
  yield put(closeAddressEditSession({ role: 'sender' }))
}

function* resetEnvelopeRecipientUiAfterWorkspaceClear(): SagaIterator {
  yield put(clearRecipientViewDraft())
  yield put(clearRecipientFormData())
  yield put(setRecipientViewId(null))
  yield put(setRecipientView('recipientsView'))
  yield put(setCurrentRecipientsList('first'))
  /** Сначала envelopeRecipients — иначе processEnvelopeVisuals снова заполнит view ids. */
  yield put(setRecipientsList([]))
  yield put(clearRecipientsPending())
  yield put(setRecipientsViewIds([]))
  yield put(setRecipientsViewIdsSecondList([]))
  yield put(closeAddressEditSession({ role: 'recipient' }))
  yield put(setAddressFormView({ show: false, role: null }))
}

/** Card pie: единственная строка ушла в корзину — пустой редактор и placeholder в списке. */
export function* clearCardPieWorkspaceAfterCartAdd(): SagaIterator {
  yield* handleClearAllMiniSectionsAction()
  yield* resetEnvelopeRecipientUiAfterWorkspaceClear()
  yield* resetEnvelopeSenderUiAfterWorkspaceClear()
  yield put(closeAddressList())
  yield put(clearText())
  yield put(resetEditor())
}
