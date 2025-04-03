import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Status.scss'
import { infoButtons } from '../../redux/infoButtons/actionCreators'
import {
  addFullCard,
  // expendShopping,
  choiceClip,
} from '../../redux/layout/actionCreators'
import {
  getAllBlanks,
  deleteBlank,
  getAllHiPostImages,
  getAllUserImages,
  getAllShopping,
  deleteShopping,
} from '../../utils/cardFormNav/indexDB/indexDb'
import { changeIconStyles } from '../../data/toolbar/changeIconStyles'
import { addIconToolbar } from '../../data/toolbar/addIconToolbar'

const Status = () => {
  const infoBtnsStatus = useSelector((state) => state.infoButtons.status)
  // const infoAddFullCard = useSelector((state) => state.infoButtons.addFullCard)
  const infoAddFullCard = useSelector((state) => state.layout.addFullCard)
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
  // const infoExpendShopping = useSelector((state) => state.layout.expendShopping)
  const [btnsStatus, setBtnsStatus] = useState({ status: infoBtnsStatus })
  const [countShopping, setCountShopping] = useState(null)
  const [countBlanks, setCountBlanks] = useState(null)
  const listBtnsStatus = ['shopping', 'clip']
  const btnIconRefs = useRef({})
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const maxCardsList = useSelector((state) => state.layout.maxCardsList)
  const dispatch = useDispatch()

  const updateStatus = async () => {
    const shopping = await getAllShopping()
    const blanks = await getAllBlanks()
    setBtnsStatus((state) => {
      return {
        ...state,
        status: {
          ...state.status,
          shopping: Boolean(shopping.length),
          clip: Boolean(blanks.length),
        },
      }
    })
    setCountShopping(shopping.length > 0 ? shopping.length : 0)
    setCountBlanks(blanks.length > 0 ? blanks.length : 0)
  }

  useEffect(() => {
    updateStatus()
  }, [])

  useEffect(() => {
    if (btnsStatus && btnIconRefs.current) {
      changeIconStyles(btnsStatus, btnIconRefs.current)
    }
  }, [btnsStatus])

  useEffect(() => {
    updateStatus()
    if (infoAddFullCard) {
      const timerIcon = setTimeout(() => {
        dispatch(addFullCard(false))
      }, 300)

      return () => clearTimeout(timerIcon)
    }
  }, [infoAddFullCard, dispatch])

  // const clearBase = async () => {
  //   const shopping = await getAllBlanks()
  //   for (const el of shopping) {
  //     await deleteBlank(el.id)
  //   }
  //   const shoppingResult = await getAllBlanks()
  //   console.log('resultMemory', shoppingResult)
  // }

  const handleClickBtn = (evt) => {
    const parentBtn = evt.target.closest('.toolbar-btn')
    switch (parentBtn.dataset.tooltip) {
      case 'shopping':
        dispatch(choiceClip(infoChoiceClip === 'shopping' ? false : 'shopping'))
        break
      case 'clip':
        // clearBase()
        dispatch(choiceClip(infoChoiceClip === 'blanks' ? false : 'blanks'))
        break

      default:
        break
    }
  }

  return (
    <div className="status-container">
      {listBtnsStatus.map((btn, i) => (
        <button
          className={`toolbar-btn toolbar-btn-${btn}`}
          data-tooltip={btn}
          key={`${btn}-${i}`}
          ref={setBtnIconRef(`status-${btn}`)}
          onClick={handleClickBtn}
        >
          {addIconToolbar(btn)}
          {btn === 'shopping' && countShopping ? (
            <span className={`counter-container ${btn}-counter-container`}>
              <span className={`status-counter ${btn}-counter`}>
                {countShopping}
              </span>
            </span>
          ) : (
            <></>
          )}
          {btn === 'clip' && countBlanks ? (
            <span className={`counter-container ${btn}-counter-container`}>
              <span className={`status-counter ${btn}-counter`}>
                {countBlanks}
              </span>
            </span>
          ) : (
            <></>
          )}
        </button>
      ))}
    </div>
  )
}

export default Status
