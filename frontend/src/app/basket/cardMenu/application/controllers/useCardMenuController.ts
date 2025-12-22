import { useDispatch, useSelector } from 'react-redux'
import {
  setActiveSection,
  resetActiveSection,
} from '../../infrastructure/state'
import { getActiveSection } from '../../infrastructure/selectors'
import type { CardMenuSection } from '@shared/config/constants'

export const useCardMenuController = () => {
  const dispatch = useDispatch()
  const activeSection = useSelector(getActiveSection)

  const handleSetActiveSection = (section: CardMenuSection) => {
    dispatch(setActiveSection(section))
  }

  const handleResetActiveSection = () => {
    dispatch(resetActiveSection())
  }

  return {
    state: { activeSection },
    actions: {
      setActiveSection: handleSetActiveSection,
      resetActiveSection: handleResetActiveSection,
    },
  }
}
