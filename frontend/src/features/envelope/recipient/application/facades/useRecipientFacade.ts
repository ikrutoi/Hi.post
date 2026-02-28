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
  setEnabled,
  updateRecipientField,
} from '../../infrastructure/state'
import { selectRecipientTemplateId } from '@envelope/infrastructure/selectors'
import {
  setRecipientMode,
  setRecipientDraft,
} from '@envelope/infrastructure/state'
import type { AddressField } from '@shared/config/constants'

function hasAddressData(data: Record<string, string>): boolean {
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

  const update = (field: AddressField, value: string) =>
    dispatch(updateRecipientField({ field, value }))

  const clear = () => dispatch(clearRecipient())
  const toggleEnabled = () => {
    const nextEnabled = !isEnabled
    // Сохраняем в черновик только данные из режима «создание/редактирование» (без шаблона).
    // Если на экране сохранённый шаблон (recipientTemplateId != null), не перезаписываем черновик —
    // иначе потеряем ранее введённые данные, которые уже лежат в draft.
    if (
      nextEnabled &&
      hasAddressData(state.data) &&
      recipientTemplateId == null
    ) {
      dispatch(setRecipientDraft({ ...state.data }))
    }
    dispatch(setEnabled(nextEnabled))
    dispatch(setRecipientMode(nextEnabled ? 'recipients' : 'recipient'))
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
