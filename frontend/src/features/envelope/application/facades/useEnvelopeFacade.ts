import { useEnvelopeController } from '../controllers'

export const useEnvelopeFacade = () => {
  const {
    envelope,
    isEnvelopeComplete,
    isSenderComplete,
    isRecipientComplete,
    actions,
  } = useEnvelopeController()

  return {
    state: {
      envelope,
      isEnvelopeComplete,
      isSenderComplete,
      isRecipientComplete,
    },
    actions,
  }
}
