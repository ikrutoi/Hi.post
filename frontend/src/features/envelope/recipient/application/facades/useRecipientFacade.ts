import { useAppDispatch, useAppSelector } from '@app/hooks'
import { recipientLayout } from '../../domain/types'
import {
  selectIsRecipientComplete,
  selectRecipientAddress,
  selectRecipientCompletedFields,
  selectRecipientState,
} from '../../infrastructure/selectors'
import {
  clearRecipient,
  updateRecipientField,
} from '../../infrastructure/state'
import type { AddressField } from '@shared/config/constants'

export const useRecipientFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectRecipientState)
  const address = useAppSelector(selectRecipientAddress)
  const completedFields = useAppSelector(selectRecipientCompletedFields)
  const isComplete = useAppSelector(selectIsRecipientComplete)

  const update = (field: AddressField, value: string) =>
    dispatch(updateRecipientField({ field, value }))

  const clear = () => dispatch(clearRecipient())

  return {
    state,
    address,
    completedFields,
    isComplete,
    layout: recipientLayout,

    update,
    clear,
  }
}
