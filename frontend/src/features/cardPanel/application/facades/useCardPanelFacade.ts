import { useMemo } from 'react'
import { useCardPanelController } from '../controllers'

export const useCardPanelFacade = () => {
  const { state, actions } = useCardPanelController()

  const viewFlags = useMemo(() => {
    const isTemplateMode = state.source === 'templates'
    const isReadyToSend = state.isPacked && state.source === 'sections'
    const isScrollable = isTemplateMode && state.templateList.length > 5

    return {
      isTemplateMode,
      isReadyToSend,
      isScrollable,
      isCompactView: state.isPacked,
    }
  }, [state.source, state.isPacked, state.templateList.length])

  return {
    state,
    actions,
    viewFlags,
  }
}
