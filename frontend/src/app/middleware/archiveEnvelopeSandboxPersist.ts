import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { updateItem } from '@cart/infrastructure/state'
import { storeAdapters } from '@db/adapters/storeAdapters'
import type { PostcardHydrated } from '@entities/postcard'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import { selectArchiveEnvelopeSandbox } from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

/** Persist sandbox sender/recipient onto the archive postcard by localId. */
export function* persistArchiveEnvelopeSandbox(): SagaIterator {
  const sandbox = yield select(selectArchiveEnvelopeSandbox)
  if (sandbox.localId == null) return

  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((p) => p.localId === sandbox.localId)
  if (postcard == null) return

  const sender = sandbox.sender
  const recipient = sandbox.recipient
  const senderApplied =
    Boolean(sender.appliedLocked) || (sender.applied?.length ?? 0) > 0
  const recipientApplied = (recipient.applied?.length ?? 0) > 0
  const envelope: EnvelopeSessionRecord = {
    sender: JSON.parse(JSON.stringify(sender)),
    recipient: JSON.parse(JSON.stringify(recipient)),
    isComplete: senderApplied && recipientApplied,
  }

  const nextPostcard: PostcardHydrated = {
    ...postcard,
    updatedAt: Date.now(),
    card: {
      ...postcard.card,
      envelope,
    },
  }
  try {
    yield call([storeAdapters.postcards, 'put'], nextPostcard)
  } catch (e) {
    console.error('persistArchiveEnvelopeSandbox: persist failed', e)
  }
  yield put(updateItem(nextPostcard))
  yield put(postcardLocalDataChanged())
}

export function* selectIsArchiveEnvelopeSandboxActive(): SagaIterator<boolean> {
  const localId: number | null = yield select(
    (s: RootState) => s.archiveEnvelopeSandbox.localId,
  )
  return localId != null
}
