import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  updateField,
  setEnabled,
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
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectSenderState)
  const address = useAppSelector(selectSenderAddress)
  const completedFields = useAppSelector(selectSenderCompletedFields)
  const isComplete = useAppSelector(selectIsSenderComplete)
  const isEnabled = useAppSelector(selectIsSenderEnabled)

  const update = (field: AddressField, value: string) =>
    dispatch(updateField({ field, value }))

  const toggleEnabled = (enabled: boolean) => dispatch(setEnabled(enabled))

  const clear = () => dispatch(clearSender())

  return {
    state,
    address,
    completedFields,
    isComplete,
    isEnabled,
    update,
    toggleEnabled,
    clear,
  }
}
