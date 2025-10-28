import { useRef } from 'react'
import { SECTIONS_TOOLBAR } from '@shared/config/constants'
import { handleMouseLeaveBtn } from '../helpers'
import { useToolbarFacade } from '../facades'
import { CardphotoToolbarState } from '../../domain/types'
import type { MouseEvent } from 'react'
import type { SectionsToolbar, IconState } from '@shared/config/constants'

export const useCardphotoToolbarUI = (section: SectionsToolbar) => {
  if (!SECTIONS_TOOLBAR.includes(section)) return null

  const { state, actions } = useToolbarFacade('cardphoto')
  const { crop, download } = state as CardphotoToolbarState

  const buttonIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const setButtonIconRef = (id: string) => (el: HTMLButtonElement | null) => {
    buttonIconRefs.current[id] = el
  }

  const searchParentBtnNav = (el: HTMLElement | null): HTMLElement | null => {
    if (!el) return null
    if (el.classList.contains('toolbar-btn')) return el
    return el.parentElement ? searchParentBtnNav(el.parentElement) : null
  }

  const getBtnType = (el: HTMLElement): string | null => {
    const match = Array.from(el.classList).find((cls) =>
      cls.startsWith('toolbar__btn--')
    )
    return match ? match.replace('toolbar__btn--', '') : null
  }

  const handleClickButton = (
    evt: MouseEvent<HTMLButtonElement>,
    btn: string
  ) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    switch (btn) {
      case 'download':
        if (download === 'enabled' || download === 'active') {
          actions.updateKey('download', 'disabled')
        }
        break
      case 'save':
        actions.updateCurrent({ save: 'disabled', crop: 'enabled' })
        break
      case 'crop':
        const saveState: IconState =
          state.save === 'enabled' ? 'disabled' : 'enabled'
        actions.updateCurrent({ save: saveState, crop: 'enabled' })
        break
    }
  }

  const handleMouseLeave = (evt: MouseEvent<HTMLButtonElement>) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    const btnType = getBtnType(parentBtn)

    if (btnType === 'download' && state.download !== 'disabled') {
      actions.updateKey('download', 'enabled')
    }

    if (btnType === 'crop' && crop === 'enabled') {
      actions.updateKey('crop', 'enabled')
    }

    handleMouseLeaveBtn(evt)
  }

  return {
    setButtonIconRef,
    handleClickButton,
    handleMouseLeave,
  }
}
