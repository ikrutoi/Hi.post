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
import { selectArchiveEnvelopeSandboxActive } from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectArchiveSandboxSender } from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import {
  setArchiveSenderEnabled,
  setArchiveSenderView,
  setArchiveSenderViewId,
  updateArchiveSenderField,
} from '@cardPanel/infrastructure/state'

function isAddressComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => (val ?? '').trim() !== '')
}

export const useSenderFacade = () => {
  const dispatch = useAppDispatch()
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)

  const sessionState = useAppSelector(selectSenderState)
  const sessionAddress = useAppSelector(selectSenderCardAddress)
  const sessionFormDraft = useAppSelector(selectSenderFormDraft)
  const sessionCompletedFields = useAppSelector(selectSenderCompletedFields)
  const sessionIsComplete = useAppSelector(selectIsSenderComplete)
  const sessionIsEnabled = useAppSelector(selectIsSenderEnabled)
  const activeAddressList = useAppSelector(selectActiveAddressList)
  const listPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const selectedId = useAppSelector(selectSenderSelectedId)

  const state = sandboxActive ? sandboxSender : sessionState
  const address = sandboxActive
    ? sandboxSender.currentView === 'senderCreate'
      ? sandboxSender.formDraft
      : sandboxSender.viewDraft
    : sessionAddress
  const formDraft = sandboxActive ? sandboxSender.formDraft : sessionFormDraft
  const completedFields = sandboxActive
    ? (Object.keys(sandboxSender.viewDraft) as AddressField[]).filter(
        (k) => String(sandboxSender.viewDraft[k] ?? '').trim() !== '',
      )
    : sessionCompletedFields
  const isComplete = sandboxActive
    ? isAddressComplete(
        sandboxSender.currentView === 'senderCreate'
          ? sandboxSender.formDraft
          : sandboxSender.viewDraft,
      )
    : sessionIsComplete
  const isEnabled = sandboxActive ? sandboxSender.enabled : sessionIsEnabled

  const selectFromList = useCallback(
    (entry: { id: string; address: Record<string, string> }) => {
      if (sandboxActive) {
        dispatch(setArchiveSenderViewId(entry.id))
        ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
          ([field, value]) =>
            dispatch(updateArchiveSenderField({ field, value })),
        )
        dispatch(setArchiveSenderView('senderView'))
        return
      }
      dispatch(setSenderViewId(entry.id))
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) => dispatch(updateSenderField({ field, value })),
      )
      dispatch(setSenderView('senderView'))
    },
    [dispatch, sandboxActive],
  )

  const update = useCallback(
    (field: AddressField, value: string) => {
      if (sandboxActive) {
        dispatch(updateArchiveSenderField({ field, value }))
        return
      }
      dispatch(updateSenderField({ field, value }))
    },
    [dispatch, sandboxActive],
  )

  const toggleEnabled = useCallback(
    (enabled: boolean) => {
      if (sandboxActive) {
        dispatch(setArchiveSenderEnabled(enabled))
        if (!enabled && activeAddressList === 'sender') {
          dispatch(closeAddressList())
        }
        return
      }
      dispatch(setEnabled(enabled))
      if (!enabled && activeAddressList === 'sender') dispatch(closeAddressList())
    },
    [dispatch, activeAddressList, sandboxActive],
  )

  const clear = useCallback(() => {
    if (sandboxActive) return
    dispatch(clearSender())
  }, [dispatch, sandboxActive])

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
