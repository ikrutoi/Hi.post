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
import { AddressField, ADDRESS_FIELD_ORDER } from '@/shared/config/constants'
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
import {
  setSenderDraft,
  closeSenderListPanel as closeSenderListPanelAction,
} from '@envelope/infrastructure/state'

function hasAddressData(data: Record<string, string> | null | undefined): boolean {
  if (data == null) return false
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

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

  const addressEquals = useCallback(
    (a: Record<string, string>, b: Record<string, string>) =>
      ADDRESS_FIELD_ORDER.every((f) => (a[f] ?? '').trim() === (b[f] ?? '').trim()),
    [],
  )

  const selectFromList = useCallback(
    (entry: { id: string; address: Record<string, string> }) => {
      if (senderView === 'addressFormSenderView') {
        if (hasAddressData(state.addressFormData) && !addressEquals(state.addressFormData, entry.address)) {
          dispatch(setSenderDraft({ ...state.addressFormData }))
        }
      }
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(([field, value]) =>
        dispatch(updateSenderField({ field, value })),
      )
      dispatch(setSenderViewId(entry.id))
      dispatch(setSenderView('senderView'))
      dispatch(closeSenderListPanelAction())
    },
    [dispatch, senderView, state.addressFormData, addressEquals],
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
