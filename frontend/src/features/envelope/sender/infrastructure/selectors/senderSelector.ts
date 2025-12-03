import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState } from '@envelope/domain/types'

export const selectSenderState = (state: RootState): SenderState => state.sender

export const selectSenderAddress = createSelector(
  [selectSenderState],
  (sender): Readonly<AddressFields> => sender.data
)

export const selectSenderField = (
  state: RootState,
  field: keyof AddressFields
): string => state.sender.data[field]

export const selectSenderCompletedFields = createSelector(
  [selectSenderState],
  (sender): (keyof AddressFields)[] =>
    (Object.keys(sender.data) as (keyof AddressFields)[]).filter(
      (key) => sender.data[key].trim() !== ''
    )
)

export const selectIsSenderComplete = createSelector(
  [selectSenderState],
  (sender): boolean => {
    if (!sender.enabled) return true
    return Object.values(sender.data).every((val) => val.trim() !== '')
  }
)

export const selectIsSenderEnabled = (state: RootState): boolean =>
  state.sender.enabled
