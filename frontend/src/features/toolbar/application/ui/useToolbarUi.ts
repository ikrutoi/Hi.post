// @toolbar/application/ui/useToolbarUI.ts
import { useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateButtonsState } from '@features/toolbar/infrastructure/state/infoButtonsSlice'
import { handleMouseLeaveBtn } from '@data/toolbar/handleMouse'
import { CARD_SECTIONS } from '@shared/types'
import type { MouseEvent } from 'react'
import type { CardSectionName, ToolbarState } from '@shared/types'

export const useToolbarUI = (section: CardSectionName) => {
  const dispatch = useAppDispatch()
  const sectionState = useAppSelector((state) => state[CARD_SECTIONS][section])
  const cropState = useAppSelector((state) => state.infoButtons.crop)
  const layoutIndexDb = useAppSelector((state) => state.layout.indexDb)

  const btnIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const setBtnIconRef = (id: string) => (el: HTMLButtonElement | null) => {
    btnIconRefs.current[id] = el
  }

  const searchParentBtnNav = (el: HTMLElement | null): HTMLElement | null => {
    if (!el) return null
    if (el.classList.contains('toolbar-btn')) return el
    return el.parentElement ? searchParentBtnNav(el.parentElement) : null
  }

  const handleClickBtn = (evt: MouseEvent<HTMLButtonElement>, btn: string) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    dispatch(
      updateButtonsState({ [`${section}Click`]: parentBtn.dataset.tooltip })
    )

    const currentState = sectionState

    switch (btn) {
      case 'download':
        if (currentState.download) {
          dispatch(
            updateButtonsState({
              [section]: { ...currentState, download: false },
            })
          )
        }
        break
      case 'save':
        dispatch(
          updateButtonsState({
            [section]: { ...currentState, save: false, crop: true },
          })
        )
        break
      case 'crop':
        dispatch(
          updateButtonsState({
            [section]: {
              ...currentState,
              crop: 'hover',
              save: currentState.save ? false : true,
              maximaze: currentState.save ? false : true,
            },
          })
        )
        break
    }
  }

  const handleMouseLeave = (evt: MouseEvent<HTMLButtonElement>) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    const tooltip = parentBtn.dataset.tooltip
    const currentState = sectionState

    if (tooltip === 'download' && !currentState.download) {
      dispatch(
        updateButtonsState({
          [section]: { ...currentState, download: true },
        })
      )
    }

    if (tooltip === 'crop' && !cropState && currentState.crop === 'hover') {
      dispatch(
        updateButtonsState({
          [section]: { ...currentState, crop: true },
        })
      )
    }

    handleMouseLeaveBtn(evt, { [section]: currentState })
  }

  return {
    setBtnIconRef,
    handleClickBtn,
    handleMouseLeave,
  }
}
