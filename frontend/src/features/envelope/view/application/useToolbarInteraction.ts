import { useEffect } from 'react'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from 'shared-legacy/uiLegacy/toolbar/handleMouse'
import { changeIconStyles } from 'shared-legacy/uiLegacy/toolbar/changeIconStyles'

type InteractionParams = {
  btnsAddress: Record<
    string,
    {
      save: boolean
      delete: boolean
      clip: boolean | string
    }
  >
  btnIconRefs: React.RefObject<Record<string, HTMLElement>>
}

export const useToolbarInteraction = ({
  btnsAddress,
  btnIconRefs,
}: InteractionParams) => {
  const handleMouseEnter = (evt: React.MouseEvent<HTMLElement>) => {
    handleMouseEnterBtn(evt, btnsAddress)
  }

  const handleMouseLeave = (evt: React.MouseEvent<HTMLElement>) => {
    handleMouseLeaveBtn(evt, btnsAddress)
  }

  useEffect(() => {
    if (btnsAddress && btnIconRefs.current) {
      changeIconStyles(btnsAddress, btnIconRefs.current)
    }
  }, [btnsAddress])

  return {
    handleMouseEnter,
    handleMouseLeave,
  }
}
