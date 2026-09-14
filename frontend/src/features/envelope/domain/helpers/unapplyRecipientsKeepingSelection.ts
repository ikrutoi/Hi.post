import type { AppDispatch } from '@app/state'
import { restoreRecipientsPendingIds } from '@envelope/infrastructure/state'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { setArchiveRecipientApplied } from '@cardPanel/infrastructure/state'

/**
 * postcardEdit / un-apply: keep Recipients form + template-list selection.
 * Apply peek stores ids on `applied` and often clears `recipientsPendingIds`,
 * so Apply looks disabled and the address book has no checkmarks.
 */
export function unapplyRecipientsKeepingSelection(
  dispatch: AppDispatch,
  input: {
    sandbox: boolean
    appliedIds: string[]
    viewIds: string[]
  },
): void {
  const ids =
    input.appliedIds.length > 0 ? input.appliedIds : input.viewIds
  if (ids.length > 0) {
    dispatch(restoreRecipientsPendingIds(ids))
  }
  if (input.sandbox) {
    dispatch(setArchiveRecipientApplied(false))
  } else {
    dispatch(setRecipientApplied(false))
  }
}
