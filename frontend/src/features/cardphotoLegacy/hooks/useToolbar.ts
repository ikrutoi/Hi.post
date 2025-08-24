import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { updateButtonsState } from '@store/slices/infoButtonsSlice'
import { changeIconStyles } from '@shared/toolbar/changeIconStyles'
import { handleMouseLeaveBtn } from '@shared/toolbar/handleMouse'
import listBtnsCardphoto from '@shared/toolbar/listBtnsCardphoto.json'
import { RootState } from '@app/store/store'

export const useToolbar = () => {
  const dispatch = useDispatch()
  const infoButtonsCardphoto = useSelector(
    (state: RootState) => state.infoButtons.cardphoto
  )
  const infoCrop = useSelector((state: RootState) => state.infoButtons.crop)
  const layoutIndexDb = useSelector((state: RootState) => state.layout.indexDb)

  const btnIconRefs = useRef<Record<string, HTMLElement | null>>({})
  const [btnsCardphoto, setBtnsCardphoto] = useState<Record<string, any>>({})

  const setBtnIconRef = (id: string) => (el: HTMLElement | null) => {
    btnIconRefs.current[id] = el
  }

  useEffect(() => {
    if (btnsCardphoto && btnIconRefs.current) {
      changeIconStyles({ cardphoto: btnsCardphoto }, btnIconRefs.current)
    }
  }, [btnsCardphoto])

  useEffect(() => {
    if (listBtnsCardphoto && infoButtonsCardphoto) {
      const mapped = listBtnsCardphoto.reduce<Record<string, any>>(
        (acc, key) => {
          acc[key] = infoButtonsCardphoto[key]
          return acc
        },
        {}
      )
      setBtnsCardphoto(mapped)
    }
  }, [])

  useEffect(() => {
    const isImagePresent =
      layoutIndexDb.hiPostImages.workingImage ||
      layoutIndexDb.userImages.originalImage ||
      layoutIndexDb.userImages.workingImage

    setBtnsCardphoto((prev) => ({ ...prev, delete: isImagePresent }))
    dispatch(
      updateButtonsState({
        cardphoto: { ...infoButtonsCardphoto, delete: isImagePresent },
      })
    )
  }, [layoutIndexDb])

  const handleClickBtn = (btn: string) => {
    switch (btn) {
      case 'download':
        if (btnsCardphoto.download) {
          setBtnsCardphoto((prev) => ({ ...prev, download: false }))
          dispatch(
            updateButtonsState({
              cardphoto: { ...infoButtonsCardphoto, download: false },
            })
          )
        }
        break
      case 'save':
        setBtnsCardphoto((prev) => ({ ...prev, save: false, crop: true }))
        dispatch(
          updateButtonsState({
            cardphoto: { ...infoButtonsCardphoto, save: false, crop: true },
          })
        )
        break
      case 'crop':
        const toggle = !btnsCardphoto.save
        setBtnsCardphoto((prev) => ({
          ...prev,
          crop: 'hover',
          save: toggle,
          maximaze: toggle,
        }))
        dispatch(
          updateButtonsState({
            cardphoto: {
              ...infoButtonsCardphoto,
              crop: 'hover',
              save: toggle,
              maximaze: toggle,
            },
          })
        )
        break
    }
  }

  const handleMouseLeave = (btn: string) => {
    if (btn === 'download' && !btnsCardphoto.download) {
      setBtnsCardphoto((prev) => ({ ...prev, download: true }))
      dispatch(
        updateButtonsState({
          cardphoto: { ...infoButtonsCardphoto, download: true },
        })
      )
    }

    if (btn === 'crop' && !infoCrop && btnsCardphoto.crop === 'hover') {
      setBtnsCardphoto((prev) => ({ ...prev, crop: true }))
      dispatch(
        updateButtonsState({
          cardphoto: { ...infoButtonsCardphoto, crop: true },
        })
      )
    }
  }

  return {
    btnsCardphoto,
    setBtnIconRef,
    handleClickBtn,
    handleMouseLeave,
  }
}
