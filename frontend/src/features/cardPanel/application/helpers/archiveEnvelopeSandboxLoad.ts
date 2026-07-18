import type { AppDispatch } from '@app/state/store'
import type { RootState } from '@app/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  clearArchiveEnvelopeSandbox,
  loadArchiveEnvelopeSandbox,
} from '@cardPanel/infrastructure/state'

/** Load right-mode envelope into sandbox from the selected postcard (no session hydrate). */
export function dispatchLoadArchiveEnvelopeSandbox(
  dispatch: AppDispatch,
  getState: () => RootState,
  input: {
    localId: number
    source: 'cart' | 'history'
  },
): boolean {
  const postcard = selectCartItems(getState()).find(
    (p) => p.localId === input.localId,
  )
  if (postcard == null) return false
  const envelope = postcard.card.envelope
  dispatch(
    loadArchiveEnvelopeSandbox({
      localId: input.localId,
      source: input.source,
      sender: envelope.sender,
      recipient: envelope.recipient,
      envelopeIsComplete: envelope.isComplete,
    }),
  )
  return true
}

export function dispatchClearArchiveEnvelopeSandbox(
  dispatch: AppDispatch,
): void {
  dispatch(clearArchiveEnvelopeSandbox())
}
