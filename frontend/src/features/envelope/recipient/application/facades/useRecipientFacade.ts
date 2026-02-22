import { useAppDispatch, useAppSelector } from '@app/hooks'
import { recipientLayout } from '../../domain/types'
import {
  selectIsRecipientComplete,
  selectRecipientAddress,
  selectRecipientCompletedFields,
  selectRecipientEnabled,
  selectRecipientState,
} from '../../infrastructure/selectors'
import {
  clearRecipient,
  setEnabled,
  updateRecipientField,
} from '../../infrastructure/state'
import type { AddressField } from '@shared/config/constants'

export const useRecipientFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectRecipientState)
  const address = useAppSelector(selectRecipientAddress)
  const completedFields = useAppSelector(selectRecipientCompletedFields)
  const isComplete = useAppSelector(selectIsRecipientComplete)
  const isEnabled = useAppSelector(selectRecipientEnabled)

  const update = (field: AddressField, value: string) =>
    dispatch(updateRecipientField({ field, value }))

  const clear = () => dispatch(clearRecipient())
  const toggleEnabled = () => dispatch(setEnabled(!isEnabled))

  return {
    state,
    address,
    completedFields,
    isComplete,
    isEnabled,
    layout: recipientLayout,

    update,
    clear,
    toggleEnabled,
  }
}
