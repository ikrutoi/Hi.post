import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateField, clearRecipient } from '../../infrastructure/state'
import {
  selectRecipientState,
  selectRecipientAddress,
  selectRecipientField,
  selectRecipientCompletedFields,
  selectIsRecipientComplete,
} from '../../infrastructure/selectors'
import type { AddressField } from '@shared/config/constants'

export const useRecipientController = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectRecipientState)
  const address = useAppSelector(selectRecipientAddress)
  const completedFields = useAppSelector(selectRecipientCompletedFields)
  const isComplete = useAppSelector(selectIsRecipientComplete)

  const update = (field: AddressField, value: string) =>
    dispatch(updateField({ field, value }))

  const clear = () => dispatch(clearRecipient())

  return {
    state,
    address,
    completedFields,
    isComplete,
    update,
    clear,
  }
}
