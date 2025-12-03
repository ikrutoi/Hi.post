import { useDispatch, useSelector } from 'react-redux'
import {
  updateField,
  setComplete,
  toggleEnabled,
  clearSender,
} from '../../infrastructure/state'
import {
  selectSenderState,
  selectSenderAddress,
  selectSenderField,
  selectSenderCompletedFields,
  selectIsSenderComplete,
  selectIsSenderEnabled,
} from '../../infrastructure/selectors'
import type { AddressField } from '@shared/config/constants'

export const useSenderController = () => {
  const dispatch = useDispatch()

  const state = useSelector(selectSenderState)
  const address = useSelector(selectSenderAddress)
  const completedFields = useSelector(selectSenderCompletedFields)
  const isComplete = useSelector(selectIsSenderComplete)
  const isEnabled = useSelector(selectIsSenderEnabled)

  const update = (field: AddressField, value: string) =>
    dispatch(updateField({ field, value }))

  const markComplete = (complete: boolean) => dispatch(setComplete(complete))

  const toggle = (enabled: boolean) => dispatch(toggleEnabled(enabled))

  const clear = () => dispatch(clearSender())

  return {
    state,
    address,
    completedFields,
    isComplete,
    isEnabled,
    update,
    markComplete,
    toggle,
    clear,
  }
}
