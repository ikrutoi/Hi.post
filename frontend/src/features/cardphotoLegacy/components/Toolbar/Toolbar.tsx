import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './Toolbar.scss'

import listBtnsCardphoto from '../../../../data/toolbar/listBtnsCardphoto.json'
import { addIconToolbar } from '../../../../data/toolbar/getIconElement'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../../../../data/toolbar/handleMouse'
import { changeIconStyles } from '../../../../data/toolbar/changeIconStyles'
import { updateButtonsState } from '../../../../store/slices/infoButtonsSlice'
import type { RootState } from '@app/store/store'

type ButtonState = boolean | 'hover'
type CardphotoButton = string

interface CardphotoState {
  [key: string]: ButtonState
}

interface BtnsCardphoto {
  cardphoto: CardphotoState
}

type BtnIconRefs = {
  [key: string]: HTMLElement | null
}

export const Toolbar: React.FC = () => {
  const infoButtonsCardphoto = useSelector(
    (state: RootState) => state.infoButtons.cardphoto
  )
  const infoCrop = useSelector((state: RootState) => state.infoButtons.crop)
  const layoutIndexDb = useSelector((state: RootState) => state.layout.indexDb)

  const btnIconRefs = useRef<BtnIconRefs>({})
  const [btnsCardphoto, setBtnsCardphoto] = useState<BtnsCardphoto>({
    cardphoto: {},
  })

  const dispatch = useDispatch()

  const setBtnIconRef = (id: string) => (element: HTMLElement | null) => {
    btnIconRefs.current[id] = element
  }

  useEffect(() => {
    if (btnsCardphoto && btnIconRefs.current) {
      changeIconStyles(btnsCardphoto, btnIconRefs.current)
    }
  }, [btnsCardphoto])

  useEffect(() => {
    if (listBtnsCardphoto && infoButtonsCardphoto) {
      setBtnsCardphoto((state) => ({
        ...state,
        cardphoto: {
          ...state.cardphoto,
          ...listBtnsCardphoto.reduce<CardphotoState>((acc, key) => {
            acc[key] = infoButtonsCardphoto[key]
            return acc
          }, {}),
        },
      }))
    }
  }, [])

  useEffect(() => {
    const isImagePresent =
      layoutIndexDb.hiPostImages.workingImage ||
      layoutIndexDb.userImages.originalImage ||
      layoutIndexDb.userImages.workingImage

    setBtnsCardphoto((state) => ({
      ...state,
      cardphoto: {
        ...state.cardphoto,
        delete: isImagePresent,
      },
    }))

    dispatch(
      updateButtonsState({
        cardphoto: {
          ...infoButtonsCardphoto,
          delete: isImagePresent,
        },
      })
    )
  }, [layoutIndexDb, dispatch])

  const searchParentBtnNav = (el: HTMLElement): HTMLElement | null => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement as HTMLElement)
    }
    return null
  }

  const handleClickBtn = (
    evt: React.MouseEvent<HTMLButtonElement>,
    btn: CardphotoButton
  ) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn?.dataset.tooltip) return

    dispatch(updateButtonsState({ cardphotoClick: parentBtn.dataset.tooltip }))

    switch (btn) {
      case 'download':
        if (btnsCardphoto.cardphoto.download) {
          setBtnsCardphoto((state) => ({
            ...state,
            cardphoto: {
              ...state.cardphoto,
              download: false,
            },
          }))
          dispatch(
            updateButtonsState({
              cardphoto: {
                ...infoButtonsCardphoto,
                download: false,
              },
            })
          )
        }
        break
      case 'save':
        setBtnsCardphoto((state) => ({
          ...state,
          cardphoto: {
            ...state.cardphoto,
            save: false,
            crop: true,
          },
        }))
        dispatch(
          updateButtonsState({
            cardphoto: {
              ...infoButtonsCardphoto,
              save: false,
              crop: true,
            },
          })
        )
        break
      case 'crop':
        setBtnsCardphoto((state) => ({
          ...state,
          cardphoto: {
            ...state.cardphoto,
            crop: 'hover',
            save: btnsCardphoto.cardphoto.save ? false : true,
            maximaze: btnsCardphoto.cardphoto.save ? false : true,
          },
        }))
        dispatch(
          updateButtonsState({
            cardphoto: {
              ...infoButtonsCardphoto,
              crop: 'hover',
              save: btnsCardphoto.cardphoto.save ? false : true,
              maximaze: btnsCardphoto.cardphoto.save ? false : true,
            },
          })
        )
        break
    }
  }

  const handleMouseLeave = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const parentBtn = searchParentBtnNav(evt.target as HTMLElement)
    if (!parentBtn?.dataset.tooltip) return

    if (
      !btnsCardphoto.cardphoto.download &&
      parentBtn.dataset.tooltip === 'download'
    ) {
      setBtnsCardphoto((state) => ({
        ...state,
        cardphoto: {
          ...state.cardphoto,
          download: true,
        },
      }))
      dispatch(
        updateButtonsState({
          cardphoto: {
            ...infoButtonsCardphoto,
            download: true,
          },
        })
      )
    }

    if (
      parentBtn.dataset.tooltip === 'crop' &&
      !infoCrop &&
      btnsCardphoto.cardphoto.crop === 'hover'
    ) {
      setBtnsCardphoto((state) => ({
        ...state,
        cardphoto: {
          ...state.cardphoto,
          crop: true,
        },
      }))
      dispatch(
        updateButtonsState({
          cardphoto: {
            ...infoButtonsCardphoto,
            crop: true,
          },
        })
      )
    }

    handleMouseLeaveBtn(evt, btnsCardphoto)
  }

  return (
    <div className="toolbar-cardphoto">
      {listBtnsCardphoto.map((btn, i) => (
        <button
          key={`${i}-${btn}`}
          data-tooltip={btn}
          data-section="cardphoto"
          ref={setBtnIconRef(`cardphoto-${btn}`)}
          className={`toolbar-btn toolbar-btn-cardphoto btn-cardphoto-${btn}`}
          onClick={(evt) => handleClickBtn(evt, btn)}
          onMouseEnter={(evt) => handleMouseEnterBtn(evt)}
          onMouseLeave={(evt) => handleMouseLeave(evt)}
        >
          {addIconToolbar(btn)}
        </button>
      ))}
    </div>
  )
}
