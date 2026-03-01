import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState, SenderView } from '../../domain/types'

export const selectSenderState = (state: RootState): SenderState => state.sender

export const selectSenderView = (state: RootState): SenderView =>
  state.sender.currentView ?? 'addressFormSenderView'

export const selectSenderAddressFormData = createSelector(
  [selectSenderState],
  (sender): Readonly<AddressFields> => sender.addressFormData,
)

export const selectSenderAddress = selectSenderAddressFormData

export const selectSenderField = (
  state: RootState,
  field: keyof AddressFields,
): string => state.sender.addressFormData[field]

export const selectSenderCompletedFields = createSelector(
  [selectSenderState],
  (sender): (keyof AddressFields)[] =>
    (Object.keys(sender.addressFormData) as (keyof AddressFields)[]).filter(
      (key) => sender.addressFormData[key].trim() !== '',
    ),
)

export const selectIsSenderComplete = createSelector(
  [selectSenderState],
  (sender) => sender.addressFormIsComplete,
)

export const selectIsSenderEnabled = (state: RootState): boolean =>
  state.sender.enabled

export const selectSenderViewId = (state: RootState): string | null =>
  state.sender.senderViewId

export const selectSenderApplied = (state: RootState): string[] =>
  state.sender.applied ?? []
