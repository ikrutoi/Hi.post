import { useAromaController } from '../controllers/useAromaController'
import { aromaIndexes } from '@entities/aroma/domain/types'

export const useAromaFacade = () => {
  const { state, actions } = useAromaController()

  return {
    state: {
      selectedAroma: state.selectedAroma,
      isAromaComplete: state.isAromaComplete,
    },
    layout: {
      aromaIndexes,
    },
    actions: {
      chooseAroma: actions.chooseAroma,
      clear: actions.clear,
    },
  }
}
