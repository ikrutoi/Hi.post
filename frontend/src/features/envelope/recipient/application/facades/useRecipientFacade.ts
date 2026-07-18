import { useMemo } from 'react'
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
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { updateArchiveRecipientField } from '@cardPanel/infrastructure/state'

function isAddressComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => (val ?? '').trim() !== '')
}

function hasAddressFields(data: AddressFields | null | undefined): boolean {
  if (data == null) return false
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

function buildSandboxRecipientsDisplayList(
  recipient: ReturnType<typeof selectArchiveSandboxRecipient>,
  bookEntries: AddressBookEntry[],
): AddressBookEntry[] {
  const listIds =
    recipient.currentRecipientsList === 'second'
      ? (recipient.recipientsViewIdsSecondList ?? [])
      : (recipient.recipientsViewIdsFirstList ?? [])
  const ids =
    listIds.length > 0
      ? listIds
      : recipient.recipientViewId != null
        ? [recipient.recipientViewId]
        : (recipient.applied ?? []).filter(Boolean)

  return ids.flatMap((id) => {
    const fromBook = bookEntries.find((e) => e.id === id)
    const singleSnapshot =
      ids.length === 1
        ? hasAddressFields(recipient.appliedData)
          ? recipient.appliedData
          : hasAddressFields(recipient.viewDraft)
            ? recipient.viewDraft
            : null
        : null
    const address = singleSnapshot ?? fromBook?.address ?? null
    if (address == null || !hasAddressFields(address as AddressFields)) {
      return []
    }
    return [
      {
        id,
        role: 'recipient' as const,
        address: { ...(address as AddressFields) },
        createdAt: fromBook?.createdAt ?? new Date().toISOString(),
      } satisfies AddressBookEntry,
    ]
  })
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
  const sessionRecipientsDisplayList = useAppSelector(selectRecipientsDisplayList)
  const recipientEntries = useAppSelector(
    (state) => state.addressBook?.recipientEntries ?? [],
  )

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

  const recipientsDisplayList = useMemo(() => {
    if (!sandboxActive) return sessionRecipientsDisplayList
    return buildSandboxRecipientsDisplayList(sandboxRecipient, recipientEntries)
  }, [sandboxActive, sandboxRecipient, recipientEntries, sessionRecipientsDisplayList])

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
    recipientTemplateId: sandboxActive
      ? sandboxRecipient.recipientViewId
      : recipientTemplateId,

    update,
    clear,
  }
}
