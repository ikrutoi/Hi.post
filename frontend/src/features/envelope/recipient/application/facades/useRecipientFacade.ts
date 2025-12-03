import { useRecipientController } from '../controllers'
import { recipientLayout } from '../../domain/types'

export const useRecipientFacade = () => {
  const {
    state,
    address,
    completedFields,
    isComplete,
    update,
    markComplete,
    clear,
  } = useRecipientController()

  return {
    state: {
      state,
      address,
      completedFields,
      isComplete,
    },
    layout: recipientLayout,
    actions: {
      update,
      markComplete,
      clear,
    },
  }
}
