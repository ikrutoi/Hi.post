import { useCardMenuNavFacade } from './useCardMenuNavFacade'
import { useTemplateNavFacade } from './useTemplateNavFacade'

export const useLayoutNavFacade = () => {
  const cardMenu = useCardMenuNavFacade()
  const template = useTemplateNavFacade()

  return {
    state: {
      selectedCardMenuSection: cardMenu.state.selectedCardMenuSection,
      selectedTemplate: template.state.selectedTemplate,
    },
    actions: {
      selectCardMenuSection: cardMenu.actions.selectCardMenuSection,
      clearCardMenu: cardMenu.actions.clearCardMenu,
      selectTemplate: template.actions.selectTemplate,
      clearTemplate: template.actions.clearTemplate,
    },
  }
}
