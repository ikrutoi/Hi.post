import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectSenderState,
  selectSenderView,
} from '../../sender/infrastructure/selectors'
import {
  selectRecipientDisplayAddress,
  selectAppliedRecipientDisplayAddress,
  selectRecipientState,
  selectRecipientView,
} from '../../recipient/infrastructure/selectors'
import { selectRecipientsDisplayList } from '../../recipient/infrastructure/selectors'
import {
  selectIsEnvelopeReady,
  selectRecipientsPendingIds,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
  selectActiveAddressList,
  selectRecipientMode,
  selectRecipientsList,
  selectRecipientTemplateId,
  selectSenderTemplateId,
  selectSelectedRecipientEntriesInOrder,
  selectRecipientListPendingIds,
  selectSenderSelectedId,
  selectShowAddressFormView,
  selectAddressFormViewRole,
  selectShowAddressFormCloseButton,
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
  setActiveAddressList,
  closeAddressList,
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
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { selectRecipientEnabled } from '../../recipient/infrastructure/selectors'

export const useEnvelopeFacade = () => {
  const dispatch = useAppDispatch()

  const sender = useAppSelector(selectSenderState)
  const recipient = useAppSelector(selectRecipientState)
  const addressRecipient = useAppSelector(selectRecipientDisplayAddress)
  const appliedRecipientAddress = useAppSelector(
    selectAppliedRecipientDisplayAddress,
  )
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeReady)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const activeAddressList = useAppSelector(selectActiveAddressList)
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
  const showAddressFormCloseButton = useAppSelector(
    selectShowAddressFormCloseButton,
  )
  const recipientEnabled = useAppSelector(selectRecipientEnabled)

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
    const listOpen =
      activeAddressList === 'recipient' || activeAddressList === 'recipients'
    const next = listOpen
      ? null
      : recipientMode === 'recipients'
        ? 'recipients'
        : 'recipient'
    dispatch(setActiveAddressList(next))
  }

  const closeRecipientListPanel = () => {
    dispatch(closeAddressList())
  }

  const removeRecipientFromList = (id: string) => {
    if (id.startsWith('recipient-')) {
      const index = parseInt(id.replace('recipient-', ''), 10)
      if (!Number.isNaN(index)) dispatch(removeRecipientAt(index))
    } else {
      dispatch(toggleRecipientSelection(id))
    }
  }

  const selectRecipientFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    if (recipient.mode === 'recipients') {
      dispatch(toggleRecipientSelection(entry.id))
    } else {
      dispatch(setRecipientViewId(entry.id))
      dispatch(setRecipientView('recipientView'))
    }
  }

  const selectSenderFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    dispatch(setSenderView('senderView'))
    dispatch(setSenderViewId(entry.id))
    ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
      ([field, value]) => dispatch(updateSenderField({ field, value })),
    )
    dispatch(closeAddressList())
  }

  const toggleSenderListPanelOpen = () => {
    const next = activeAddressList === 'sender' ? null : 'sender'
    dispatch(setActiveAddressList(next))
  }

  const closeSenderListPanel = () => {
    dispatch(closeAddressList())
  }

  const setAddressFormViewState = (
    show: boolean,
    role: 'sender' | 'recipient' | null,
  ) => {
    dispatch(setAddressFormView({ show, role }))
  }

  const closeAddressForm = (role: 'sender' | 'recipient') => {
    dispatch(setAddressFormView({ show: false, role: null }))
    if (role === 'sender') {
      dispatch(setSenderView('senderView'))
    } else {
      dispatch(
        setRecipientView(recipientEnabled ? 'recipientsView' : 'recipientView'),
      )
    }
  }

  const syncAddressFormToolbar = (
    section: 'addressFormSenderView' | 'addressFormRecipientView',
    isAddressComplete: boolean,
  ) => {
    const state = isAddressComplete ? 'enabled' : 'disabled'
    dispatch(
      updateToolbarIcon({
        section,
        key: 'listAdd',
        value: { state },
      }),
    )
    dispatch(
      updateToolbarIcon({
        section,
        key: 'apply',
        value: { state, options: {} },
      }),
    )
  }

  return {
    sender,
    recipient,
    addressRecipient,
    appliedRecipientAddress,
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
    activeAddressList,

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
    closeAddressForm,
    syncAddressFormToolbar,
    showAddressFormCloseButton,
  }
}
