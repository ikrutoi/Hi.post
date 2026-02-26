import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectSenderState } from '../../sender/infrastructure/selectors'
import {
  selectRecipientAddress,
  selectRecipientState,
} from '../../recipient/infrastructure/selectors'
import {
  selectIsEnvelopeReady,
  selectSelectedRecipientIds,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
  selectRecipientMode,
  selectRecipientsList,
  selectRecipientTemplateId,
  selectSenderTemplateId,
  selectSelectedRecipientEntriesInOrder,
  selectRecipientsDisplayList,
  selectListSelectedIds,
  selectSenderSelectedId,
} from '../../infrastructure/selectors'
import {
  updateRecipientField,
  clearRecipient,
  setRecipientApplied,
} from '../../recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '../../sender/infrastructure/state'
import {
  toggleRecipientSelection,
  setSelectedRecipientIds,
  clearRecipientSelection,
  toggleRecipientListPanel,
  closeRecipientListPanel as closeRecipientListPanelAction,
  toggleSenderListPanel,
  closeSenderListPanel as closeSenderListPanelAction,
  setRecipientTemplateId,
  setSenderTemplateId,
} from '../../infrastructure/state/envelopeSelectionSlice'
import {
  clearRecipientsList,
  removeRecipientAt,
} from '../../infrastructure/state'
import {
  ADDRESS_FIELD_ORDER,
  type AddressField,
  type EnvelopeRole,
} from '@shared/config/constants'

export const useEnvelopeFacade = () => {
  const dispatch = useAppDispatch()

  const sender = useAppSelector(selectSenderState)
  const recipient = useAppSelector(selectRecipientState)
  const addressRecipient = useAppSelector(selectRecipientAddress)
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeReady)
  const selectedRecipientIds = useAppSelector(selectSelectedRecipientIds)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientMode = useAppSelector(selectRecipientMode)
  const listSelectedIds = useAppSelector(selectListSelectedIds)
  const senderSelectedId = useAppSelector(selectSenderSelectedId)
  const recipients = useAppSelector(selectRecipientsList)
  const recipientTemplateId = useAppSelector(selectRecipientTemplateId)
  const senderTemplateId = useAppSelector(selectSenderTemplateId)
  const selectedRecipientEntriesInOrder = useAppSelector(
    selectSelectedRecipientEntriesInOrder,
  )
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)

  const handleFieldChange = (
    role: EnvelopeRole,
    field: AddressField,
    value: string,
  ) => {
    const action = role === 'sender' ? updateSenderField : updateRecipientField
    dispatch(action({ field, value }))
  }

  const toggleSenderEnabled = (enabled: boolean) => {
    dispatch(setEnabled(enabled))
  }

  const clearRole = (role: EnvelopeRole) => {
    if (role === 'sender') {
      dispatch(setSenderTemplateId(null))
      dispatch(clearSender())
    } else {
      dispatch(setRecipientTemplateId(null))
      dispatch(clearRecipient())
    }
  }

  const fullClear = () => {
    dispatch(setRecipientTemplateId(null))
    dispatch(clearRecipient())
    if (sender.enabled) {
      dispatch(setSenderTemplateId(null))
      dispatch(clearSender())
    }
  }

  const cancelEnvelopeSelection = () => {
    if (recipientMode === 'recipient') {
      dispatch(setRecipientApplied(false))
    } else {
      dispatch(clearRecipientsList())
    }
  }

  const toggleRecipientSelectionById = (id: string) => {
    dispatch(toggleRecipientSelection(id))
  }

  const setRecipientSelection = (ids: string[]) => {
    dispatch(setSelectedRecipientIds(ids))
  }

  const clearRecipientSelectionIds = () => {
    dispatch(clearRecipientSelection())
  }

  const toggleRecipientListPanelOpen = () => {
    dispatch(toggleRecipientListPanel())
  }

  const closeRecipientListPanel = () => {
    dispatch(closeRecipientListPanelAction())
  }

  const removeRecipientFromList = (id: string) => {
    if (id.startsWith('recipient-')) {
      const index = parseInt(id.replace('recipient-', ''), 10)
      if (!Number.isNaN(index)) dispatch(removeRecipientAt(index))
    } else {
      dispatch(toggleRecipientSelection(id))
    }
  }

  const selectRecipientFromList = (entry: { id: string; address: Record<string, string> }) => {
    if (recipient.enabled) {
      dispatch(toggleRecipientSelection(entry.id))
    } else {
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) => dispatch(updateRecipientField({ field, value })),
      )
      dispatch(setRecipientTemplateId(entry.id))
    }
  }

  const selectSenderFromList = (entry: { id: string; address: Record<string, string> }) => {
    ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
      ([field, value]) => dispatch(updateSenderField({ field, value })),
    )
    dispatch(setSenderTemplateId(entry.id))
  }

  const toggleSenderListPanelOpen = () => {
    dispatch(toggleSenderListPanel())
  }

  const closeSenderListPanel = () => {
    dispatch(closeSenderListPanelAction())
  }

  return {
    sender,
    recipient,
    addressRecipient,
    isEnvelopeComplete,
    addressFields: ADDRESS_FIELD_ORDER,
    isSenderVisible: sender.enabled,

    selectedRecipientIds,
    recipientListPanelOpen,
    senderListPanelOpen,
    listSelectedIds,
    senderSelectedId,
    recipientMode,
    recipients,
    recipientTemplateId,
    senderTemplateId,
    selectedRecipientEntriesInOrder,
    recipientsDisplayList,

    handleFieldChange,
    toggleSenderEnabled,
    clearRole,
    fullClear,
    cancelEnvelopeSelection,

    toggleRecipientSelectionById,
    setRecipientSelection,
    clearRecipientSelectionIds,
    toggleRecipientListPanelOpen,
    closeRecipientListPanel,
    removeRecipientFromList,
    selectRecipientFromList,
    selectSenderFromList,
    toggleSenderListPanelOpen,
    closeSenderListPanel,
  }
}
