import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setComplete } from '../../infrastructure/state'
import { useSenderFacade } from '../../sender/application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'

export const useEnvelopeController = () => {
  const dispatch = useAppDispatch()
  const isEnvelopeComplete = useAppSelector((s) => s.envelope.isComplete)

  const { state: stateSender, actions: actionsSender } = useSenderFacade()
  const { isEnabled, isComplete: isCompleteSender } = stateSender
  const { clear: actionsClearSender } = actionsSender

  const { state: stateRecipient, actions: actionsRecipient } =
    useRecipientFacade()
  const { isComplete: isCompleteRecipient } = stateRecipient
  const { clear: actionsClearRecipient } = actionsRecipient

  const clearSender = () => {
    actionsClearSender()
  }

  const clearRecipient = () => {
    actionsClearRecipient()
  }

  const reset = () => {
    actionsClearSender()
    actionsClearRecipient()
  }

  useEffect(() => {
    const senderReady = (isCompleteSender && isEnabled) || !isEnabled
    const recipientReady = isCompleteRecipient
    const envelopeReady = senderReady && recipientReady
    dispatch(setComplete(envelopeReady))
  }, [dispatch, isCompleteSender, isEnabled, isCompleteRecipient])

  return {
    state: {
      isEnvelopeComplete,
    },
    actions: {
      clearSender,
      clearRecipient,
      reset,
    },
  }
}
