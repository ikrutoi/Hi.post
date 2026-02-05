import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectActiveSection } from '../../infrastructure/selectors'
import {
  setActiveSection,
  resetActiveSection,
} from '../../infrastructure/state'
import { SectionEditorMenuKey } from '@toolbar/domain/types'

export const useSectionMenuFacade = () => {
  const dispatch = useAppDispatch()

  const activeSection = useAppSelector(selectActiveSection)
  const isHydrated = activeSection !== null

  const changeSection = (key: SectionEditorMenuKey) => {
    dispatch(setActiveSection(key))
  }

  const resetMenu = () => {
    dispatch(resetActiveSection())
  }

  return {
    state: {
      activeSection,
      isHydrated,
    },

    actions: {
      changeSection,
      resetMenu,
    },
  }
}
