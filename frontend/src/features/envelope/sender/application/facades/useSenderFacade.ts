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
    markComplete,
    toggle,
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
      markComplete,
      toggle,
      clear,
    },
  }
}
