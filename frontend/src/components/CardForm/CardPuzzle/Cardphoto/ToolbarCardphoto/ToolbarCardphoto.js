import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ToolbarCardphoto.scss'
import listBtnsCardphoto from '../../../../../data/toolbar/listBtnsCardphoto.json'
import { addIconToolbar } from '../../../../../data/toolbar/addIconToolbar'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../../../../../data/toolbar/handleMouse'
import { changeIconStyles } from '../../../../../data/toolbar/changeIconStyles'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'

const ToolbarCardphoto = () => {
  const infoButtonsCardphoto = useSelector(
    (state) => state.infoButtons.cardphoto
  )
  const btnIconRefs = useRef({})
  const [btnsCardphoto, setBtnsCardphoto] = useState({ cardphoto: {} })
  const dispatch = useDispatch()

  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }

  useEffect(() => {
    if (btnsCardphoto && btnIconRefs.current) {
      changeIconStyles(btnsCardphoto, btnIconRefs.current)
    }
  }, [btnsCardphoto, btnIconRefs])

  useEffect(() => {
    if (listBtnsCardphoto && infoButtonsCardphoto) {
      setBtnsCardphoto((state) => {
        return {
          ...state,
          cardphoto: {
            ...state.cardphoto,
            ...listBtnsCardphoto.reduce((acc, key) => {
              acc[key] = infoButtonsCardphoto[key]
              return acc
            }, {}),
          },
        }
      })
    }
  }, [])

  const searchParentBtnNav = (el) => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement)
    }
    return null
  }

  const handleClickBtn = (evt, btn) => {
    const parentBtn = searchParentBtnNav(evt.target)

    dispatch(infoButtons({ cardphotoClick: parentBtn.dataset.tooltip }))

    // if (parentBtn === 'download') {
    //   if (btnsCardphoto.download) {
    //     setBtnsCardphoto((state) => {
    //       return {
    //         ...state,
    //         cardphoto: { ...state.cardphoto, download: false },
    //       }
    //     })
    //   }
    // }
  }

  return (
    <div className="toolbar-cardphoto-left">
      {listBtnsCardphoto &&
        listBtnsCardphoto.map((btn, i) => {
          return (
            <button
              key={`${i}-${btn}`}
              data-tooltip={btn}
              data-section={'cardphoto'}
              ref={setBtnIconRef(`cardphoto-${btn}`)}
              className={`toolbar-btn toolbar-btn-cardphoto btn-cardphoto-${btn}`}
              onClick={(evt) => handleClickBtn(evt, btn)}
              onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardphoto)}
              onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardphoto)}
            >
              {addIconToolbar(btn)}
            </button>
          )
        })}
    </div>
  )
}

export default ToolbarCardphoto
