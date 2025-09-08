import { useEffect, useRef, useState } from 'react'

import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'

// import { useCardphotoButtonsFacade } from '@features/cardphoto/application/fasades/useCardphotoButtonsFasade'
import { toolbarButtons } from '@features/cardphoto/shared/config/toolbarButtons'
import { updateCardphotoButtonsState } from '../store/cardphotoButtonsSlice'
import { setCardphotoButtonActive } from '../state/cardphotoActiveSlice'

// import { handleMouseLeaveBtn } from '@data/toolbar/handleMouse'

import { changeIconStyles } from '@data/toolbar/changeIconStyles'

interface BtnState {
  [key: string]: boolean | 'hover'
}

export const useToolbarFacade = () => {
  const dispatch = useAppDispatch()

  // const {
  //   download,
  //   save,
  //   delete: deleteButton,
  //   crop,
  //   maximaze,
  //   turn,
  // } = useCardphotoButtonsFacade()
  // const { updateState, ...cardButtons } = useCardphotoButtonsFacade()

  const cardButtonsState = useAppSelector((state) => state.cardphotoButtons)
  // const cardphotoActive = useAppSelector((state) => state.cardphotoActive)
  const indexDb = useAppSelector((state) => state.layout.indexDb)

  const btnIconRefs = useRef<Record<string, HTMLElement | null>>({})
  const [btns, setBtns] = useState<BtnState>({})

  const setBtnIconRef = (id: string) => (el: HTMLElement | null) => {
    btnIconRefs.current[id] = el
  }

  useEffect(() => {
    const initialState = toolbarButtons.reduce((acc, key) => {
      acc[key] = cardButtonsState[key]
      return acc
    }, {} as BtnState)
    setBtns(initialState)
  }, [])

  useEffect(() => {
    if (btns && btnIconRefs.current) {
      changeIconStyles({ cardphoto: btns }, btnIconRefs.current)
    }
  }, [btns])

  useEffect(() => {
    const isImagePresent =
      indexDb.stockImages.workingImage ||
      indexDb.userImages.originalImage ||
      indexDb.userImages.workingImage

    setBtns((prev) => ({ ...prev, delete: isImagePresent }))

    dispatch(
      updateCardphotoButtonsState({
        delete: !!isImagePresent,
      })
    )
  }, [indexDb])

  const searchParentBtnNav = (el: HTMLElement): HTMLElement | null => {
    if (el.classList.contains('toolbar-btn')) return el
    return el.parentElement ? searchParentBtnNav(el.parentElement) : null
  }

  const handleClickBtn = (evt: React.MouseEvent, btn: string) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    dispatch(setCardphotoButtonActive(parentBtn.dataset.tooltip))

    switch (btn) {
      case 'download':
        if (btns.download) {
          setBtns((prev) => ({ ...prev, download: false }))
          dispatch(
            updateCardphotoButtonsState({
              download: false,
            })
          )
        }
        break

      case 'save':
        setBtns((prev) => ({ ...prev, save: false, crop: true }))
        dispatch(
          updateCardphotoButtonsState({
            save: false,
            crop: true,
          })
        )
        break

      case 'crop':
        setBtns((prev) => ({
          ...prev,
          crop: 'hover',
          save: prev.save ? false : true,
          maximaze: prev.save ? false : true,
        }))
        dispatch(
          updateCardphotoButtonsState({
            crop: true,
            save: btns.save ? false : true,
            maximaze: btns.save ? false : true,
          })
        )
        break
    }
  }

  const handleMouseLeave = (evt: React.MouseEvent) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn) return

    const tooltip = parentBtn.dataset.tooltip

    if (tooltip === 'download' && btns.download === false) {
      setBtns((prev) => ({ ...prev, download: true }))
      dispatch(
        updateCardphotoButtonsState({
          download: true,
        })
      )
    }

    if (tooltip === 'crop' && !cardButtonsState.crop && btns.crop === 'hover') {
      setBtns((prev) => ({ ...prev, crop: true }))
      dispatch(
        updateCardphotoButtonsState({
          crop: true,
        })
      )
    }

    // handleMouseLeaveBtn(evt, { cardphoto: btns })
  }

  return {
    btns,
    btnIconRefs,
    setBtnIconRef,
    handleClickBtn,
    handleMouseLeave,
  }
}
