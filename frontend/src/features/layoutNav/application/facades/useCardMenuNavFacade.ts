import { useAppSelector } from '@app/hooks'
import { getSelectedCardMenuSection } from '../../infrastructure/selectors'
import { useCardMenuNavController } from '../controllers'

export const useCardMenuNavFacade = () => {
  const selectedCardMenuSection = useAppSelector(getSelectedCardMenuSection)
  const { state, actions } = useCardMenuNavController()

  return {
    state: {
      selectedCardMenuSection,
    },
    actions: {
      ...state,
      ...actions,
    },
  }
}
