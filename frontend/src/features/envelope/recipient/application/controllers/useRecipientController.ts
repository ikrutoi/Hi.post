import { useDispatch, useSelector } from 'react-redux'
import {
  updateField,
  setComplete,
  clearRecipient,
} from '../../infrastructure/state'
import {
  selectRecipientState,
  selectRecipientAddress,
  selectRecipientField,
  selectRecipientCompletedFields,
  selectIsRecipientComplete,
} from '../../infrastructure/selectors'
import type { AddressField } from '@shared/config/constants'

export const useRecipientController = () => {
  const dispatch = useDispatch()

  const state = useSelector(selectRecipientState)
  const address = useSelector(selectRecipientAddress)
  const completedFields = useSelector(selectRecipientCompletedFields)
  const isComplete = useSelector(selectIsRecipientComplete)

  const update = (field: AddressField, value: string) =>
    dispatch(updateField({ field, value }))

  const markComplete = (complete: boolean) => dispatch(setComplete(complete))

  const clear = () => dispatch(clearRecipient())

  return {
    state,
    address,
    completedFields,
    isComplete,
    update,
    markComplete,
    clear,
  }
}
