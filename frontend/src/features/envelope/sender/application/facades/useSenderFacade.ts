import { useAppDispatch, useAppSelector } from '@app/hooks'
import { senderLayout } from '../../domain/types'
import { useCallback } from 'react'
import {
  selectIsSenderComplete,
  selectIsSenderEnabled,
  selectSenderAddress,
  selectSenderCompletedFields,
  selectSenderState,
} from '../../infrastructure/selectors'
import { AddressField } from '@/shared/config/constants'
import {
  clearSender,
  setEnabled,
  updateSenderField,
} from '../../infrastructure/state'

export const useSenderFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectSenderState)
  const address = useAppSelector(selectSenderAddress)
  const completedFields = useAppSelector(selectSenderCompletedFields)
  const isComplete = useAppSelector(selectIsSenderComplete)
  const isEnabled = useAppSelector(selectIsSenderEnabled)

  const update = useCallback(
    (field: AddressField, value: string) =>
      dispatch(updateSenderField({ field, value })),
    [dispatch],
  )

  const toggleEnabled = useCallback(
    (enabled: boolean) => dispatch(setEnabled(enabled)),
    [dispatch],
  )

  const clear = useCallback(() => dispatch(clearSender()), [dispatch])

  return {
    state,
    address,
    completedFields,
    isComplete,
    isEnabled,
    layout: senderLayout,

    update,
    toggleEnabled,
    clear,
  }
}
