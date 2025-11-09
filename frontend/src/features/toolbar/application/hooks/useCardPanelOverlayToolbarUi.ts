import { useRef } from 'react'
import { useToolbarFacade } from '../facades'
import type { ToolbarSection } from '../../domain/types'

export const useCardPanelOverlayToolbarUI = (section: ToolbarSection) => {
  const { state, actions } = useToolbarFacade('cardPanelOverlay')

  const buttonIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const setButtonIconRef = (id: string) => (el: HTMLButtonElement | null) => {
    buttonIconRefs.current[id] = el
  }

  const handleClickButton = () => {
    console.log('handleClickButton')
  }
  // const handleClickButton = (
  //   evt: MouseEvent<HTMLButtonElement>,
  //   btn: string
  // ) => {
  //   // Реализуй логику обработки кнопок для cardPanel
  //   actions.updateKey(btn, 'active')
  // }

  const handleMouseLeave = () => {
    console.log('handleMouseLeave')
  }

  return {
    setButtonIconRef,
    handleClickButton,
    handleMouseLeave,
  }
}
