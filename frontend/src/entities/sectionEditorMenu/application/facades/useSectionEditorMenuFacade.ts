import { useSectionEditorMenuController } from '../controllers'
import type { CardSection } from '@shared/config/constants'

export const useSectionEditorMenuFacade = () => {
  const { state, actions } = useSectionEditorMenuController()

  const isSectionActive = (section: CardSection) =>
    state.activeSection === section

  return {
    state,
    actions,
    helpers: {
      isSectionActive,
    },
  }
}
