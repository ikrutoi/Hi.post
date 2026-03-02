import { useAppDispatch, useAppSelector } from '@app/hooks'
import { senderLayout } from '../../domain/types'
import { useCallback } from 'react'
import {
  selectIsSenderComplete,
  selectIsSenderEnabled,
  selectSenderAddress,
  selectSenderCompletedFields,
  selectSenderState,
  selectSenderView,
} from '../../infrastructure/selectors'
import { AddressField } from '@/shared/config/constants'
import {
  clearSender,
  setEnabled,
  setSenderView,
  setSenderViewId,
  updateSenderField,
} from '../../infrastructure/state'
import {
  selectSenderListPanelOpen,
  selectSenderSelectedId,
} from '@envelope/infrastructure/selectors'
import { closeSenderListPanel as closeSenderListPanelAction } from '@envelope/infrastructure/state'

export const useSenderFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectSenderState)
  const address = useAppSelector(selectSenderAddress)
  const completedFields = useAppSelector(selectSenderCompletedFields)
  const isComplete = useAppSelector(selectIsSenderComplete)
  const isEnabled = useAppSelector(selectIsSenderEnabled)
  const senderView = useAppSelector(selectSenderView)
  const listPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const selectedId = useAppSelector(selectSenderSelectedId)

  const selectFromList = useCallback(
    (entry: { id: string; address: Record<string, string> }) => {
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(([field, value]) =>
        dispatch(updateSenderField({ field, value })),
      )
      dispatch(setSenderViewId(entry.id))
      dispatch(setSenderView('senderView'))
      dispatch(closeSenderListPanelAction())
    },
    [dispatch],
  )

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

    listPanelOpen,
    selectedId,
    selectFromList,

    update,
    toggleEnabled,
    clear,
  }
}
