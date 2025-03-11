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
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
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

  useEffect(() => {
    const isImagePresent =
      layoutIndexDb.hiPostImages.workingImage ||
      layoutIndexDb.userImages.originalImage ||
      layoutIndexDb.userImages.workingImage

    setBtnsCardphoto((state) => {
      return {
        ...state,
        cardphoto: {
          ...state.cardphoto,
          delete: isImagePresent,
        },
      }
    })
    dispatch(
      infoButtons({
        cardphoto: {
          ...infoButtonsCardphoto,
          delete: isImagePresent,
        },
      })
    )
  }, [layoutIndexDb, dispatch])

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

    switch (btn) {
      case 'download':
        if (btnsCardphoto.cardphoto.download) {
          setBtnsCardphoto((state) => {
            return {
              ...state,
              cardphoto: {
                ...state.cardphoto,
                download: false,
              },
            }
          })
          dispatch(
            infoButtons({
              cardphoto: {
                ...infoButtonsCardphoto,
                download: false,
              },
            })
          )
        }
        break
      case 'save':
        setBtnsCardphoto((state) => {
          return {
            ...state,
            cardphoto: {
              ...state.cardphoto,
              save: false,
              crop: true,
            },
          }
        })
        dispatch(
          infoButtons({
            cardphoto: {
              ...infoButtonsCardphoto,
              save: false,
              crop: true,
            },
          })
        )
        break
      case 'crop':
        setBtnsCardphoto((state) => {
          return {
            ...state,
            cardphoto: {
              ...state.cardphoto,
              crop: btnsCardphoto.cardphoto.crop === true ? 'hover' : true,
              save: btnsCardphoto.cardphoto.save ? false : true,
            },
          }
        })
        dispatch(
          infoButtons({
            cardphoto: {
              ...infoButtonsCardphoto,
              crop: btnsCardphoto.cardphoto.crop === true ? 'hover' : true,
              save: btnsCardphoto.cardphoto.save ? false : true,
            },
          })
        )
        break

      default:
        break
    }

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

  const handleMouseEnter = (evt) => {
    // const parentBtn = searchParentBtnNav(evt.target)
    // if (btnsCardphoto.cardphoto.crop === 'hover' && parentBtn === 'crop') {
    //   setBtnsCardphoto((state) => {
    //     return {
    //       ...state,
    //       cardphoto: {
    //         ...state.cardphoto,
    //         crop: 'hover',
    //       },
    //     }
    //   })
    //   dispatch(
    //     infoButtons({
    //       cardphoto: {
    //         ...infoButtonsCardphoto,
    //         crop: 'hover',
    //       },
    //     })
    //   )
    // }
    handleMouseEnterBtn(evt, btnsCardphoto)
  }

  const handleMouseLeave = (evt) => {
    const parentBtn = searchParentBtnNav(evt.target)
    if (!btnsCardphoto.cardphoto.download && parentBtn === 'download') {
      setBtnsCardphoto((state) => {
        return {
          ...state,
          cardphoto: {
            ...state.cardphoto,
            download: true,
          },
        }
      })
      dispatch(
        infoButtons({
          cardphoto: {
            ...infoButtonsCardphoto,
            download: true,
          },
        })
      )
    }
    handleMouseLeaveBtn(evt, btnsCardphoto)
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
              onMouseEnter={(evt) => handleMouseEnter(evt)}
              onMouseLeave={(evt) => handleMouseLeave(evt)}
            >
              {addIconToolbar(btn)}
            </button>
          )
        })}
    </div>
  )
}

export default ToolbarCardphoto
