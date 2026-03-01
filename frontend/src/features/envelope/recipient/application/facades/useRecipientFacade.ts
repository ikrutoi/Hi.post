import { useAppDispatch, useAppSelector } from '@app/hooks'
import { recipientLayout } from '../../domain/types'
import {
  selectIsRecipientComplete,
  selectRecipientAddress,
  selectRecipientCompletedFields,
  selectRecipientEnabled,
  selectRecipientState,
} from '../../infrastructure/selectors'
import {
  clearRecipient,
  restoreRecipient,
  setEnabled,
  setRecipientView,
  updateRecipientField,
} from '../../infrastructure/state'
import {
  selectRecipientTemplateId,
  selectRecipientDraft,
} from '@envelope/infrastructure/selectors'
import {
  setRecipientMode,
  setRecipientDraft,
} from '@envelope/infrastructure/state'
import type { AddressField } from '@shared/config/constants'

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
  const recipientTemplateId = useAppSelector(selectRecipientTemplateId)
  const recipientDraft = useAppSelector(selectRecipientDraft)

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
          enabled: false,
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

    update,
    clear,
    toggleEnabled,
  }
}
