import { useMemo } from 'react'
import { useCardtextController } from '../controllers/useCardtextController'

export const useCardtextFacade = () => {
  const { state, actions } = useCardtextController()

  const cardtext = useMemo(() => state.cardtextState, [state.cardtextState])

  return {
    cardtext,
    updateCardtext: actions.updateCardtext,
    clearCardtextContent: actions.clearCardtextContent,
    setCardtext: actions.setCardtext,
    resetCardtext: actions.resetCardtext,
  }
}
