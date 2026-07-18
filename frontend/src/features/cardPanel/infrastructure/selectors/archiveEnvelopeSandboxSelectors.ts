import type { RootState } from '@app/state'
import { initialSection } from '@envelope/addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import { createSelector } from '@reduxjs/toolkit'

export const selectArchiveEnvelopeSandbox = (state: RootState) =>
  state.archiveEnvelopeSandbox

export const selectArchiveEnvelopeSandboxActive = (state: RootState): boolean =>
  state.archiveEnvelopeSandbox.localId != null

export const selectArchiveEnvelopeSandboxLocalId = (
  state: RootState,
): number | null => state.archiveEnvelopeSandbox.localId

export const selectArchiveSandboxSender = (state: RootState) =>
  state.archiveEnvelopeSandbox.sender

export const selectArchiveSandboxRecipient = (state: RootState) =>
  state.archiveEnvelopeSandbox.recipient

export const selectArchiveSandboxSenderAppliedLocked = (
  state: RootState,
): boolean => {
  const sender = state.archiveEnvelopeSandbox.sender
  return (
    Boolean(sender.appliedLocked) || (sender.applied?.length ?? 0) > 0
  )
}

export const selectArchiveSandboxSenderApplied = (state: RootState): string[] =>
  state.archiveEnvelopeSandbox.sender.applied ?? []

export const selectArchiveSandboxRecipientApplied = (
  state: RootState,
): string[] => state.archiveEnvelopeSandbox.recipient.applied ?? []

export const selectArchiveSandboxAppliedSenderDisplayAddress = createSelector(
  [selectArchiveSandboxSender],
  (sender): Readonly<AddressFields> => {
    if (sender.appliedData != null) return sender.appliedData
    return initialSection.data
  },
)

export const selectArchiveSandboxAppliedRecipientDisplayAddress =
  createSelector(
    [selectArchiveSandboxRecipient],
    (recipient): Readonly<AddressFields> => {
      if (recipient.appliedData != null) return recipient.appliedData
      if (
        Object.values(recipient.viewDraft).some((v) => (v ?? '').trim() !== '')
      ) {
        return recipient.viewDraft
      }
      return initialSection.data
    },
  )
