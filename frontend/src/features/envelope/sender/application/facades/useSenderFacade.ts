import { useSenderController } from '../controllers'
import { senderLayout } from '../../domain/types'

export const useSenderFacade = () => {
  const {
    state,
    address,
    completedFields,
    isComplete,
    isEnabled,
    update,
    toggleEnabled,
    clear,
  } = useSenderController()

  return {
    state: {
      state,
      address,
      completedFields,
      isComplete,
      isEnabled,
    },
    layout: senderLayout,
    actions: {
      update,
      toggleEnabled,
      clear,
    },
  }
}
