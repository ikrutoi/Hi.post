import { useAppDispatch, useAppSelector } from '@app/hooks'
import { recipientLayout } from '../../domain/types'
import {
  selectIsRecipientComplete,
  selectRecipientAddress,
  selectRecipientCompletedFields,
  selectRecipientEnabled,
  selectRecipientState,
  selectRecipientView,
  selectRecipientViewId,
  selectRecipientDraft,
  selectRecipientListPendingIds,
  selectRecipientListPanelOpen,
  selectRecipientsDisplayList,
} from '../../infrastructure/selectors'
import {
  clearRecipient,
  restoreRecipient,
  setEnabled,
  setRecipientView,
  setRecipientViewId,
  updateRecipientField,
  setRecipientMode,
  setRecipientDraft,
  closeRecipientListPanel as closeRecipientListPanelAction,
  toggleRecipientSelection,
  removeRecipientAt,
} from '../../infrastructure/state'
import type { AddressField } from '@shared/config/constants'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'

function hasAddressData(data: Record<string, string> | null | undefined): boolean {
  if (data == null) return false
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

export const useRecipientFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectRecipientState)
  const address = useAppSelector(selectRecipientAddress)
  const completedFields = useAppSelector(selectRecipientCompletedFields)
  const isComplete = useAppSelector(selectIsRecipientComplete)
  const isEnabled = useAppSelector(selectRecipientEnabled)
  const recipientTemplateId = useAppSelector(selectRecipientViewId)
  const recipientDraft = useAppSelector(selectRecipientDraft)
  const recipientView = useAppSelector(selectRecipientView)
  const listSelectedIds = useAppSelector(selectRecipientListPendingIds)
  const listPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)

  const removeFromList = (id: string) => {
    if (id.startsWith('recipient-')) {
      const index = parseInt(id.replace('recipient-', ''), 10)
      if (!Number.isNaN(index)) dispatch(removeRecipientAt(index))
    } else {
      dispatch(toggleRecipientSelection(id))
    }
  }

  const addressEquals = (a: Record<string, string>, b: Record<string, string>) =>
    ADDRESS_FIELD_ORDER.every((f) => (a[f] ?? '').trim() === (b[f] ?? '').trim())

  const selectFromList = (entry: { id: string; address: Record<string, string> }) => {
    if (isEnabled) {
      dispatch(toggleRecipientSelection(entry.id))
    } else {
      if (recipientView === 'addressFormRecipientView') {
        if (hasAddressData(state.addressFormData) && !addressEquals(state.addressFormData, entry.address)) {
          dispatch(setRecipientDraft({ ...state.addressFormData }))
        }
      }
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(([field, value]) =>
        dispatch(updateRecipientField({ field, value })),
      )
      dispatch(setRecipientViewId(entry.id))
      dispatch(setRecipientView('recipientView'))
      dispatch(closeRecipientListPanelAction())
    }
  }

  const update = (field: AddressField, value: string) =>
    dispatch(updateRecipientField({ field, value }))

  const clear = () => dispatch(clearRecipient())
  const toggleEnabled = () => {
    const nextEnabled = !isEnabled
    if (
      nextEnabled &&
      hasAddressData(state.addressFormData) &&
      recipientTemplateId == null
    ) {
      dispatch(setRecipientDraft({ ...state.addressFormData }))
    }
    dispatch(setEnabled(nextEnabled))
    dispatch(setRecipientMode(nextEnabled ? 'recipients' : 'recipient'))
    if (
      !nextEnabled &&
      recipientDraft != null &&
      Object.keys(recipientDraft).length > 0
    ) {
      const draftComplete = Object.values(recipientDraft).every(
        (v) => (v ?? '').trim() !== '',
      )
      dispatch(
        restoreRecipient({
          addressFormData: recipientDraft as import('@envelope/domain/types').RecipientState['addressFormData'],
          addressFormIsComplete: draftComplete,
          mode: 'recipient',
          applied: [],
          currentView: 'addressFormRecipientView',
        }),
      )
      dispatch(setRecipientView('addressFormRecipientView'))
    }
  }

  return {
    state,
    address,
    completedFields,
    isComplete,
    isEnabled,
    layout: recipientLayout,

    listPanelOpen,
    listSelectedIds,
    selectFromList,
    recipientsDisplayList,
    removeFromList,

    update,
    clear,
    toggleEnabled,
  }
}
