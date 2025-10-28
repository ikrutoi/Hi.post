import { useAppDispatch } from '@app/hooks'
import { cardMenuNavActions } from '../../infrastructure/state'
import type { CardMenuSection } from '@shared/config/constants'

const { setSelectedCardMenuSection, clearSelectedCardMenuSection } =
  cardMenuNavActions

export const useCardMenuNavController = () => {
  const dispatch = useAppDispatch()

  const selectCardMenuSection = (section: CardMenuSection) => {
    dispatch(setSelectedCardMenuSection(section))
  }

  const clearCardMenu = () => {
    dispatch(clearSelectedCardMenuSection())
  }

  return {
    state: {
      selectCardMenuSection,
    },
    actions: {
      clearCardMenu,
    },
  }
}
