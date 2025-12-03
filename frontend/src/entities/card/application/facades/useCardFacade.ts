import { useCardController } from '../controllers/useCardController'
import { CARD_STATUSES } from '../../domain/types'

export const useCardFacade = () => {
  const { state, actions } = useCardController()

  return {
    state: {
      cards: state.cards,
      getCardById: state.getCardById,
      getCardsByStatus: state.getCardsByStatus,
    },
    layout: {
      statuses: CARD_STATUSES,
    },
    actions: {
      createCard: actions.createCard,
      changeStatus: actions.changeStatus,
      deleteCard: actions.deleteCard,
    },
  }
}
