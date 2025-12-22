import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  setActiveSection,
  resetActiveSection,
} from '../../infrastructure/state'
import { selectActiveSection } from '../../infrastructure/selectors'
import type { CardSection } from '@shared/config/constants'

export const useSectionEditorMenuController = () => {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)

  const handleSetActiveSection = useCallback(
    (section: CardSection) => dispatch(setActiveSection(section)),
    [dispatch]
  )

  const handleResetActiveSection = useCallback(
    () => dispatch(resetActiveSection()),
    [dispatch]
  )

  return {
    state: { activeSection },
    actions: {
      setActiveSection: handleSetActiveSection,
      resetActiveSection: handleResetActiveSection,
    },
  }
}
