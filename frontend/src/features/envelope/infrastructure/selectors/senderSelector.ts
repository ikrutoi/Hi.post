import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import { EMPTY_STRINGS } from '@shared/utils/helpers'
import { initialSection } from '../../addressForm/domain/models'
import type { AddressBookEntry } from '../../addressBook/domain/types'
import type { SenderState, SenderView } from '../../domain/types'

const EMPTY_ADDRESS_BOOK_ENTRIES: AddressBookEntry[] = []

export const selectSenderEntriesState = (state: RootState): AddressBookEntry[] =>
  state.addressBook?.senderEntries ?? EMPTY_ADDRESS_BOOK_ENTRIES

export const selectSenderState = (state: RootState): SenderState => state.sender

export const selectSenderView = (state: RootState): SenderView =>
  state.sender.currentView ?? 'senderView'

export const selectSenderAddressFormData = createSelector(
  [selectSenderState],
  (sender): Readonly<AddressFields> => sender.viewDraft,
)

export const selectSenderFormDraft = createSelector(
  [selectSenderState],
  (sender): Readonly<AddressFields> => sender.formDraft,
)

export const selectSenderAddress = selectSenderAddressFormData

export const selectSenderField = (
  state: RootState,
  field: keyof AddressFields,
): string => state.sender.viewDraft[field]

export const selectSenderCompletedFields = createSelector(
  [selectSenderState],
  (sender): (keyof AddressFields)[] =>
    (Object.keys(sender.viewDraft) as (keyof AddressFields)[]).filter(
      (key) => sender.viewDraft[key].trim() !== '',
    ),
)

/** Sender is retired: never blocks envelope completeness. */
export const selectIsSenderComplete = (_state: RootState): boolean => true

export const selectIsSenderEnabled = (_state: RootState): boolean => false

export const selectSenderViewId = (state: RootState): string | null =>
  state.sender.senderViewId

export const selectSenderApplied = (state: RootState): string[] =>
  state.sender.applied ?? EMPTY_STRINGS

/** Sender is retired: treated as already confirmed empty. */
export const selectSenderAppliedLocked = (_state: RootState): boolean => true

export const selectAppliedSenderDisplayAddress = createSelector(
  [selectSenderState, selectSenderEntriesState],
  (sender, entries): Readonly<AddressFields> => {
    if (sender.appliedData != null) return sender.appliedData
    const appliedId = sender.applied?.[0]
    if (appliedId) {
      const entry = entries.find((e: { id: string }) => e.id === appliedId)
      if (entry?.address) return entry.address as AddressFields
    }
    return initialSection.data
  },
)

export const selectSenderFormIsEmpty = (state: RootState): boolean =>
  state.sender.formIsEmpty ?? true
