import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import { initialSection } from '../../../addressForm/domain/models'
import type { SenderState, SenderView } from '../../domain/types'

export const selectSenderState = (state: RootState): SenderState => state.sender

export const selectSenderView = (state: RootState): SenderView =>
  state.sender.currentView ?? 'addressFormSenderView'

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

export const selectIsSenderComplete = createSelector(
  [selectSenderState],
  (sender) => sender.formIsComplete,
)

export const selectIsSenderEnabled = (state: RootState): boolean =>
  state.sender.enabled

export const selectSenderViewId = (state: RootState): string | null =>
  state.sender.senderViewId

export const selectSenderApplied = (state: RootState): string[] =>
  state.sender.applied ?? []

export const selectAppliedSenderDisplayAddress = createSelector(
  [
    selectSenderState,
    (s: RootState) => s.addressBook?.senderEntries ?? [],
  ],
  (sender, entries): Readonly<AddressFields> => {
    if (sender.appliedData != null) return sender.appliedData
    const appliedId = sender.applied?.[0]
    if (appliedId) {
      const entry = entries.find((e: { id: string }) => e.id === appliedId)
      if (entry?.address) return entry.address as AddressFields
    }
    return { ...initialSection.data }
  },
)

export const selectSenderFormIsEmpty = (state: RootState): boolean =>
  state.sender.formIsEmpty ?? true
