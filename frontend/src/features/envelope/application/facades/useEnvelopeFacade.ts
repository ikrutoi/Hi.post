import { useEnvelopeController } from '../controllers/useEnvelopeController'
import { senderLayout } from '../../sender/domain/types'
import { recipientLayout } from '../../recipient/domain/types'

export const useEnvelopeFacade = () => {
  const { state, actions } = useEnvelopeController()

  return {
    state: {
      isEnvelopeComplete: state.isEnvelopeComplete,
    },
    layout: {
      sender: senderLayout,
      recipient: recipientLayout,
    },
    actions: {
      clearSender: actions.clearSender,
      clearRecipient: actions.clearRecipient,
      reset: actions.reset,
    },
  }
}
