import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectSenderState,
  selectSenderView,
  selectAppliedSenderDisplayAddress,
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
  selectRecipientsList,
  selectRecipientTemplateId,
  selectSenderTemplateId,
  selectSelectedRecipientEntriesInOrder,
  selectRecipientListPendingIds,
  selectSenderSelectedId,
  selectShowAddressFormView,
  selectAddressFormViewRole,
  selectShowAddressFormCloseButton,
  selectSenderInListEntries,
  selectRecipientInListEntries,
  selectAddressCreateEditContext,
} from '../../infrastructure/selectors'
import {
  selectSenderEntriesState,
} from '../../sender/infrastructure/selectors'
import {
  selectRecipientEntriesState,
} from '../../recipient/infrastructure/selectors'
import {
  updateRecipientField,
  clearRecipient,
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
  type AddressFields,
  type EnvelopeRole,
} from '@shared/config/constants'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { resolveAddListToolbarState, resolveApplyMediumToolbarState } from '@envelope/domain/helpers'

export const useEnvelopeFacade = () => {
  const dispatch = useAppDispatch()

  const sender = useAppSelector(selectSenderState)
  const recipient = useAppSelector(selectRecipientState)
  const addressRecipient = useAppSelector(selectRecipientDisplayAddress)
  const appliedRecipientAddress = useAppSelector(
    selectAppliedRecipientDisplayAddress,
  )
  const appliedSenderAddress = useAppSelector(
    selectAppliedSenderDisplayAddress,
  )
  const isEnvelopeComplete = useAppSelector(selectIsEnvelopeReady)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientListPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const senderListPanelOpen = useAppSelector(selectSenderListPanelOpen)
  const activeAddressList = useAppSelector(selectActiveAddressList)
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
  const senderInListEntries = useAppSelector(selectSenderInListEntries)
  const recipientInListEntries = useAppSelector(selectRecipientInListEntries)
  const senderTemplateEntries = useAppSelector(selectSenderEntriesState)
  const recipientTemplateEntries = useAppSelector(selectRecipientEntriesState)
  const addressCreateEditContext = useAppSelector(selectAddressCreateEditContext)

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
      dispatch(setSenderView('senderCreate'))
    } else {
      dispatch(setRecipientViewId(null))
      dispatch(clearRecipient())
      dispatch(setRecipientView('recipientCreate'))
    }
  }

  const fullClear = () => {
    dispatch(setRecipientViewId(null))
    dispatch(clearRecipient())
    dispatch(setRecipientView('recipientCreate'))
    if (sender.enabled) {
      dispatch(setSenderViewId(null))
      dispatch(clearSender())
      dispatch(setSenderView('senderCreate'))
    }
  }

  const cancelEnvelopeSelection = () => {
    dispatch(clearRecipientsList())
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
    const listOpen = activeAddressList === 'recipients'
    const next = listOpen ? null : 'recipients'
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
    dispatch(toggleRecipientSelection(entry.id))
  }

  const selectSenderFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    dispatch(setSenderViewId(entry.id))
    ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
      ([field, value]) => dispatch(updateSenderField({ field, value })),
    )
    dispatch(setSenderView('senderView'))
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
      const appliedId = sender.applied?.[0]
      if (appliedId) {
        dispatch(setSenderViewId(appliedId))
      }
      dispatch(setSenderView('senderView'))
    } else if (recipientsDisplayList.length === 1) {
      dispatch(setRecipientViewId(recipientsDisplayList[0].id))
      dispatch(setRecipientView('recipientView'))
    } else {
      dispatch(setRecipientView('recipientsView'))
    }
  }

  const syncAddressFormToolbar = (
    section: 'senderCreate' | 'recipientCreate',
    isAddressComplete: boolean,
  ) => {
    const isSenderSection = section === 'senderCreate'
    const draft = (
      isSenderSection ? sender.formDraft : recipient.formDraft
    ) as AddressFields
    const inList = isSenderSection
      ? senderInListEntries
      : recipientInListEntries
    const allTemplates = isSenderSection
      ? senderTemplateEntries
      : recipientTemplateEntries
    const addListState = resolveAddListToolbarState(
      isAddressComplete,
      draft,
      inList,
    )
    const applyMediumState = resolveApplyMediumToolbarState(
      isAddressComplete,
      draft,
      allTemplates,
      isSenderSection
        ? addressCreateEditContext?.role === 'sender'
          ? addressCreateEditContext.templateId
          : null
        : addressCreateEditContext?.role === 'recipient'
          ? addressCreateEditContext.templateId
          : null,
    )
    dispatch(
      updateToolbarIcon({
        section,
        key: 'addList',
        value: { state: addListState },
      }),
    )
    dispatch(
      updateToolbarIcon({
        section,
        key: 'applyMedium',
        value: { state: applyMediumState },
      }),
    )
  }

  return {
    sender,
    recipient,
    addressRecipient,
    appliedRecipientAddress,
    appliedSenderAddress,
    isEnvelopeComplete,
    addressFields: ADDRESS_FIELD_ORDER,
    isSenderVisible: sender.enabled,

    recipientsPendingIds,
    recipientListPanelOpen,
    senderListPanelOpen,
    listSelectedIds,
    senderSelectedId,
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
