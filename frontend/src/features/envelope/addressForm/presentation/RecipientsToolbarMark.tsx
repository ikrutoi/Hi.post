import React from 'react'
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
import { IconUsers } from '@shared/ui/icons'
import styles from './RecipientsToolbarMark.module.scss'

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

/**
 * Recipient count + Users.
 * After Apply with 2+ recipients: upper envelope toolbar, right.
 * Otherwise: left of the lower View actions.
 */
export const RecipientsToolbarMark: React.FC = () => {
  const count = useRecipientsChromeCount()

  return (
    <div className={styles.mark} data-envelope-recipients-toolbar-mark>
      <IconUsers className={styles.icon} aria-hidden />
      {count > 1 ? (
        <span className={styles.count} aria-hidden>
          {count}
        </span>
      ) : null}
    </div>
  )
}
