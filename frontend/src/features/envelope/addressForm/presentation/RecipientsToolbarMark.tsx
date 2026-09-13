import React from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import {
  selectRecipientApplied,
  selectRecipientState,
  selectRecipientViewId,
} from '@envelope/recipient/infrastructure/selectors'
import { setRecipientViewId } from '@envelope/recipient/infrastructure/state'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxRecipientApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { setArchiveRecipientViewId } from '@cardPanel/infrastructure/state'

/** Applied ids after envelope Apply; otherwise Recipients view ids. */
export function useRecipientsChromeCount(): number {
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sessionAppliedIds = useAppSelector(selectRecipientApplied)
  const sandboxAppliedIds = useAppSelector(selectArchiveSandboxRecipientApplied)
  const appliedIds = sandboxActive ? sandboxAppliedIds : sessionAppliedIds
  const recipient = useAppSelector(selectRecipientState)
  const displayCount = useRecipientFacade().recipientsDisplayList.length
  const viewIds =
    recipient?.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient?.recipientsViewIdsFirstList ?? [])
  return Math.max(appliedIds.length, viewIds.length, displayCount)
}

/** After Apply with 2+ recipients: cycle the applied list (wraps). */
export function useCycleAppliedRecipientNext(): () => void {
  const dispatch = useAppDispatch()
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sessionAppliedIds = useAppSelector(selectRecipientApplied)
  const sandboxAppliedIds = useAppSelector(selectArchiveSandboxRecipientApplied)
  const appliedIds = sandboxActive ? sandboxAppliedIds : sessionAppliedIds
  const sessionViewId = useAppSelector(selectRecipientViewId)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const currentId = sandboxActive
    ? sandboxRecipient.recipientViewId
    : sessionViewId

  return React.useCallback(() => {
    if (appliedIds.length <= 1) return
    const at = currentId != null ? appliedIds.indexOf(currentId) : 0
    const index = at >= 0 ? at : 0
    const nextId = appliedIds[(index + 1) % appliedIds.length]
    if (nextId == null) return
    if (sandboxActive) {
      dispatch(setArchiveRecipientViewId(nextId))
    } else {
      dispatch(setRecipientViewId(nextId))
    }
  }, [appliedIds, currentId, dispatch, sandboxActive])
}
