import { useAppSelector } from '@app/hooks'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import {
  selectRecipientApplied,
  selectRecipientState,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipientApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'

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
