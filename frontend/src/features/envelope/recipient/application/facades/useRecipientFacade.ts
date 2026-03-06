import { useAppDispatch, useAppSelector } from '@app/hooks'
import { recipientLayout } from '../../domain/types'
import {
  selectIsRecipientComplete,
  selectRecipientDisplayAddress,
  selectRecipientCompletedFields,
  selectRecipientEnabled,
  selectRecipientState,
  selectRecipientView,
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
  setEnabled,
  setRecipientView,
  setRecipientViewId,
  updateRecipientField,
  setRecipientMode,
  toggleRecipientSelection,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
} from '../../infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { AddressField } from '@shared/config/constants'

export const useRecipientFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectRecipientState)
  const address = useAppSelector(selectRecipientDisplayAddress)
  const formDraft = useAppSelector(selectRecipientFormDraft)
  const completedFields = useAppSelector(selectRecipientCompletedFields)
  const isComplete = useAppSelector(selectIsRecipientComplete)
  const isEnabled = useAppSelector(selectRecipientEnabled)
  const recipientTemplateId = useAppSelector(selectRecipientViewId)
  const recipientView = useAppSelector(selectRecipientView)
  const listSelectedIds = useAppSelector(selectRecipientListPendingIds)
  const listPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)

  const removeFromList = (id: string) => {
    if (id.startsWith('recipient-')) {
      const index = parseInt(id.replace('recipient-', ''), 10)
      if (!Number.isNaN(index))
        dispatch(removeRecipientFromListByIndex(index))
    } else if (isEnabled) {
      dispatch(removeRecipientFromListById(id))
    } else {
      dispatch(toggleRecipientSelection(id))
    }
  }

  const selectFromList = (entry: {
    id: string
    address: Record<string, string>
  }) => {
    if (isEnabled) {
      dispatch(toggleRecipientSelection(entry.id))
    } else {
      dispatch(setRecipientView('recipientView'))
      dispatch(setRecipientViewId(entry.id))
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) => dispatch(updateRecipientField({ field, value })),
      )
    }
  }

  const update = (field: AddressField, value: string) =>
    dispatch(updateRecipientField({ field, value }))

  const clear = () => dispatch(clearRecipient())
  const toggleEnabled = () => {
    const nextEnabled = !isEnabled
    dispatch(setEnabled(nextEnabled))
    dispatch(setRecipientMode(nextEnabled ? 'recipients' : 'recipient'))
    if (!nextEnabled) {
      dispatch(
        updateToolbarIcon({
          section: 'recipient',
          key: 'apply',
          value: {
            state: recipientTemplateId ? 'enabled' : 'disabled',
          },
        }),
      )
    }
  }

  return {
    state,
    address,
    formDraft,
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
