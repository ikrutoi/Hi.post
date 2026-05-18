import { useAppDispatch, useAppSelector } from '@app/hooks'
import { senderLayout } from '../../domain/types'
import { useCallback } from 'react'
import {
  selectIsSenderComplete,
  selectIsSenderEnabled,
  selectSenderCompletedFields,
  selectSenderState,
  selectSenderView,
  selectSenderFormDraft,
} from '../../infrastructure/selectors'
import type { AddressField, AddressFields } from '@/shared/config/constants'
import {
  clearSender,
  setEnabled,
  setSenderView,
  setSenderViewId,
  updateSenderField,
} from '../../infrastructure/state'
import {
  selectActiveAddressList,
  selectSenderListPanelOpen,
  selectSenderSelectedId,
  selectSenderCardAddress,
} from '@envelope/infrastructure/selectors'
import { closeAddressList } from '@envelope/infrastructure/state'

export const useSenderFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectSenderState)
  const address = useAppSelector(selectSenderCardAddress)
  const formDraft = useAppSelector(selectSenderFormDraft)
  const completedFields = useAppSelector(selectSenderCompletedFields)
  const isComplete = useAppSelector(selectIsSenderComplete)
  const isEnabled = useAppSelector(selectIsSenderEnabled)
  const senderView = useAppSelector(selectSenderView)
  const activeAddressList = useAppSelector(selectActiveAddressList)
  const listPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const selectedId = useAppSelector(selectSenderSelectedId)

  const selectFromList = useCallback(
    (entry: { id: string; address: Record<string, string> }) => {
      dispatch(setSenderViewId(entry.id))
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) =>
          dispatch(updateSenderField({ field, value })),
      )
      dispatch(setSenderView('senderView'))
    },
    [dispatch],
  )

  const update = useCallback(
    (field: AddressField, value: string) =>
      dispatch(updateSenderField({ field, value })),
    [dispatch],
  )

  const toggleEnabled = useCallback(
    (enabled: boolean) => {
      dispatch(setEnabled(enabled))
      // Закрываем только список отправителя, список получателей не трогаем
      if (!enabled && activeAddressList === 'sender') dispatch(closeAddressList())
    },
    [dispatch, activeAddressList],
  )

  const clear = useCallback(() => dispatch(clearSender()), [dispatch])

  return {
    state,
    address,
    formDraft,
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
