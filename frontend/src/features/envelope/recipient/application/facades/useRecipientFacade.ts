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
import type { AddressField } from '@shared/config/constants'

export const useRecipientFacade = () => {
  const dispatch = useAppDispatch()

  const state = useAppSelector(selectRecipientState)
  const address = useAppSelector(selectRecipientDisplayAddress)
  const formDraft = useAppSelector(selectRecipientFormDraft)
  const completedFields = useAppSelector(selectRecipientCompletedFields)
  const isComplete = useAppSelector(selectIsRecipientComplete)
  const recipientTemplateId = useAppSelector(selectRecipientViewId)
  const listSelectedIds = useAppSelector(selectRecipientListPendingIds)
  const listPanelOpen = useAppSelector(selectRecipientListPanelOpen)
  const recipientsDisplayList = useAppSelector(selectRecipientsDisplayList)

  const removeFromList = (id: string) => {
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
    dispatch(toggleRecipientSelection(entry.id))
  }

  const update = (field: AddressField, value: string) =>
    dispatch(updateRecipientField({ field, value }))

  const clear = () => dispatch(clearRecipient())

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

    update,
    clear,
  }
}
