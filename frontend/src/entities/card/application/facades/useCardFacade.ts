import { useCardController } from '../controllers'

export const useCardFacade = () => {
  const { state, actions } = useCardController()

  const {
    card,
    cardId,
    hasAnySectionComplete,
    isCardComplete,
    completedSections,
    completionMap,
    incompleteSections,
  } = state

  const {
    updateCardphoto,
    updateCardtext,
    updateEnvelope,
    updateAroma,
    updateDate,
    updateCardId,
    clearCard,
  } = actions

  return {
    card,
    cardId,
    completedSections,
    completionMap,
    status: {
      isCardComplete,
      hasAnySectionComplete,
      incompleteSections,
    },
    actions: {
      updateCardphoto,
      updateCardtext,
      updateEnvelope,
      updateAroma,
      updateDate,
      updateCardId,
      clearCard,
    },
  }
}
