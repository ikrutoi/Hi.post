import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectSenderState,
  selectSenderView,
} from '../../sender/infrastructure/selectors'
import {
  selectRecipientAddress,
  selectRecipientState,
  selectRecipientView,
} from '../../recipient/infrastructure/selectors'
import {
  selectIsEnvelopeReady,
  selectRecipientsPendingIds,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
  selectRecipientMode,
  selectRecipientsList,
  selectRecipientTemplateId,
  selectSenderTemplateId,
  selectSelectedRecipientEntriesInOrder,
  selectRecipientsDisplayList,
  selectRecipientListPendingIds,
  selectSenderSelectedId,
  selectShowAddressFormView,
  selectAddressFormViewRole,
} from '../../infrastructure/selectors'
import {
  updateRecipientField,
  clearRecipient,
  setRecipientApplied,
  setRecipientView,
} from '../../recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
  setSenderView,
} from '../../sender/infrastructure/state'
import {
  toggleRecipientSelection,
  setRecipientsPendingIds,
  clearRecipientsPending,
  toggleRecipientListPanel,
  closeRecipientListPanel as closeRecipientListPanelAction,
  toggleSenderListPanel,
  closeSenderListPanel as closeSenderListPanelAction,
  setSenderDraft,
  setRecipientDraft,
  setAddressFormView,
} from '../../infrastructure/state/envelopeSelectionSlice'
import { setSenderViewId } from '../../sender/infrastructure/state'
import { setRecipientViewId } from '../../recipient/infrastructure/state'
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
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientMode = useAppSelector(selectRecipientMode)
  const listSelectedIds = useAppSelector(selectRecipientListPendingIds)
  const senderSelectedId = useAppSelector(selectSenderSelectedId)
  const recipients = useAppSelector(selectRecipientsList)
  const recipientTemplateId = useAppSelector(selectRecipientTemplateId)
  const senderTemplateId = useAppSelector(selectSenderTemplateId)
  const recipientView = useAppSelector(selectRecipientView)
  const senderView = useAppSelector(selectSenderView)
  const selectedRecipientEntriesInOrder = useAppSelector(
    selectSelectedRecipientEntriesInOrder,
  )
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)
  const showAddressFormView = useAppSelector(selectShowAddressFormView)
  const addressFormViewRole = useAppSelector(selectAddressFormViewRole)

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
      dispatch(setSenderViewId(null))
      dispatch(clearSender())
      dispatch(setSenderView('addressFormSenderView'))
    } else {
      dispatch(setRecipientViewId(null))
      dispatch(clearRecipient())
      dispatch(setRecipientView('addressFormRecipientView'))
    }
  }

  const fullClear = () => {
    dispatch(setRecipientViewId(null))
    dispatch(clearRecipient())
    dispatch(setRecipientView('addressFormRecipientView'))
    if (sender.enabled) {
      dispatch(setSenderViewId(null))
      dispatch(clearSender())
      dispatch(setSenderView('addressFormSenderView'))
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
    dispatch(setRecipientsPendingIds(ids))
  }

  const clearRecipientsPendingIds = () => {
    dispatch(clearRecipientsPending())
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

  const hasAddressData = (data: Record<string, string>) =>
    Object.values(data).some((v) => (v ?? '').trim() !== '')
  const addressEquals = (
    a: Record<string, string>,
    b: Record<string, string>,
  ) =>
    ADDRESS_FIELD_ORDER.every(
      (f) => (a[f] ?? '').trim() === (b[f] ?? '').trim(),
    )

  const selectRecipientFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    if (recipient.mode === 'recipients') {
      dispatch(toggleRecipientSelection(entry.id))
    } else {
      if (recipientView === 'addressFormRecipientView') {
        if (
          hasAddressData(recipient.addressFormData) &&
          !addressEquals(recipient.addressFormData, entry.address)
        ) {
          dispatch(setRecipientDraft({ ...recipient.addressFormData }))
        }
      }
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) => dispatch(updateRecipientField({ field, value })),
      )
      dispatch(setRecipientViewId(entry.id))
      dispatch(setRecipientView('recipientView'))
      dispatch(closeRecipientListPanelAction())
    }
  }

  const selectSenderFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    if (senderView === 'addressFormSenderView') {
      if (
        hasAddressData(sender.addressFormData) &&
        !addressEquals(sender.addressFormData, entry.address)
      ) {
        dispatch(setSenderDraft({ ...sender.addressFormData }))
      }
    }
    ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
      ([field, value]) => dispatch(updateSenderField({ field, value })),
    )
    dispatch(setSenderViewId(entry.id))
    dispatch(setSenderView('senderView'))
    dispatch(closeSenderListPanelAction())
  }

  const toggleSenderListPanelOpen = () => {
    dispatch(toggleSenderListPanel())
  }

  const closeSenderListPanel = () => {
    dispatch(closeSenderListPanelAction())
  }

  const setAddressFormViewState = (
    show: boolean,
    role: 'sender' | 'recipient' | null,
  ) => {
    dispatch(setAddressFormView({ show, role }))
  }

  return {
    sender,
    recipient,
    addressRecipient,
    isEnvelopeComplete,
    addressFields: ADDRESS_FIELD_ORDER,
    isSenderVisible: sender.enabled,

    recipientsPendingIds,
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
    showAddressFormView,
    addressFormViewRole,

    handleFieldChange,
    toggleSenderEnabled,
    clearRole,
    fullClear,
    cancelEnvelopeSelection,

    toggleRecipientSelectionById,
    setRecipientSelection,
    clearRecipientsPendingIds,
    toggleRecipientListPanelOpen,
    closeRecipientListPanel,
    removeRecipientFromList,
    selectRecipientFromList,
    selectSenderFromList,
    toggleSenderListPanelOpen,
    closeSenderListPanel,
    setAddressFormViewState,
  }
}
