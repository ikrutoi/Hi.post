import { useCardMenuController } from '../controllers'

export const useCardMenuFacade = () => {
  const { state, actions } = useCardMenuController()

  return {
    state,
    actions,
  }
}
