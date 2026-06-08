import { useRef } from 'react'
import { useToolbarFacade } from '../facades'
import type { ToolbarSection } from '../../domain/types'

export const useCardPanelOverlayToolbarUI = (section: ToolbarSection) => {
  const { state, actions } = useToolbarFacade('cardPanelOverlay')

  const buttonIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const setButtonIconRef = (id: string) => (el: HTMLButtonElement | null) => {
    buttonIconRefs.current[id] = el
  }

  const handleClickButton = () => {}

  const handleMouseLeave = () => {}

  return {
    setButtonIconRef,
    handleClickButton,
    handleMouseLeave,
  }
}
