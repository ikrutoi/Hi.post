import { useAppDispatch, useAppSelector } from '@app/hooks'
import { recipientLayout } from '../../domain/types'
import {
  selectIsRecipientComplete,
  selectRecipientDisplayAddress,
  selectRecipientCompletedFields,
  selectRecipientState,
  selectRecipientViewId,
  selectRecipientFormDraft,
  selectRecipientsDisplayList,
} from '../../infrastructure/selectors'
import {
  selectRecipientListPendingIds,
  selectRecipientListPanelOpen,
} from '@envelope/infrastructure/selectors'
import {
  clearRecipient,
  updateRecipientField,
  toggleRecipientSelection,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
} from '../../infrastructure/state'
import type { AddressField, AddressFields } from '@shared/config/constants'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { updateArchiveRecipientField } from '@cardPanel/infrastructure/state'

function isAddressComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => (val ?? '').trim() !== '')
}

export const useRecipientFacade = () => {
  const dispatch = useAppDispatch()
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)

  const sessionState = useAppSelector(selectRecipientState)
  const sessionAddress = useAppSelector(selectRecipientDisplayAddress)
  const sessionFormDraft = useAppSelector(selectRecipientFormDraft)
  const sessionCompletedFields = useAppSelector(selectRecipientCompletedFields)
  const sessionIsComplete = useAppSelector(selectIsRecipientComplete)
  const recipientTemplateId = useAppSelector(selectRecipientViewId)
  const listSelectedIds = useAppSelector(selectRecipientListPendingIds)
  const listPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)

  const state = sandboxActive ? sandboxRecipient : sessionState
  const address = sandboxActive
    ? sandboxRecipient.currentView === 'recipientCreate'
      ? sandboxRecipient.formDraft
      : sandboxRecipient.viewDraft
    : sessionAddress
  const formDraft = sandboxActive
    ? sandboxRecipient.formDraft
    : sessionFormDraft
  const completedFields = sandboxActive
    ? (Object.keys(sandboxRecipient.viewDraft) as AddressField[]).filter(
        (k) => String(sandboxRecipient.viewDraft[k] ?? '').trim() !== '',
      )
    : sessionCompletedFields
  const isComplete = sandboxActive
    ? isAddressComplete(
        sandboxRecipient.currentView === 'recipientCreate'
          ? sandboxRecipient.formDraft
          : sandboxRecipient.viewDraft,
      )
    : sessionIsComplete

  const removeFromList = (id: string) => {
    if (sandboxActive) return
    if (id.startsWith('recipient-')) {
      const index = parseInt(id.replace('recipient-', ''), 10)
      if (!Number.isNaN(index))
        dispatch(removeRecipientFromListByIndex(index))
    } else {
      dispatch(removeRecipientFromListById(id))
    }
  }

  const selectFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    if (sandboxActive) return
    dispatch(toggleRecipientSelection(entry.id))
  }

  const update = (field: AddressField, value: string) => {
    if (sandboxActive) {
      dispatch(updateArchiveRecipientField({ field, value }))
      return
    }
    dispatch(updateRecipientField({ field, value }))
  }

  const clear = () => {
    if (sandboxActive) return
    dispatch(clearRecipient())
  }

  return {
    state,
    address,
    formDraft,
    completedFields,
    isComplete,
    layout: recipientLayout,

    listPanelOpen,
    listSelectedIds,
    selectFromList,
    recipientsDisplayList,
    removeFromList,
    recipientTemplateId,

    update,
    clear,
  }
}
