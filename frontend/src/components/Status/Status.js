import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineShoppingCart } from 'react-icons/md'
import './Status.scss'
import { infoButtons } from '../../redux/infoButtons/actionCreators'
import {
  addFullCard,
  // expendShopping,
  choiceClip,
} from '../../redux/layout/actionCreators'
import {
  getAllCards,
  getAllHiPostImages,
  getAllUserImages,
} from '../../utils/cardFormNav/indexDB/indexDb'
import { changeIconStyles } from '../../data/toolbar/changeIconStyles'

const Status = () => {
  const infoBtnsStatus = useSelector((state) => state.infoButtons.status)
  // const infoAddFullCard = useSelector((state) => state.infoButtons.addFullCard)
  const infoAddFullCard = useSelector((state) => state.layout.addFullCard)
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
  // const infoExpendShopping = useSelector((state) => state.layout.expendShopping)
  const [btnsStatus, setBtnsStatus] = useState({ status: infoBtnsStatus })
  const [countCards, setCountCards] = useState(null)
  const listBtnsStatus = ['shopping']
  const btnIconRefs = useRef({})
  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  const dispatch = useDispatch()

  const getCards = async (pos) => {
    const cards = await getAllCards()
    switch (pos) {
      case 'reboot':
        if (cards.length > 0) {
          setBtnsStatus((state) => {
            return { ...state, status: { ...state.status, shopping: true } }
          })
          setCountCards(cards.length)
        }
        break

      default:
        break
    }
  }

  useEffect(() => {
    getCards('reboot')
  }, [])

  useEffect(() => {
    if (btnsStatus && btnIconRefs.current) {
      changeIconStyles(btnsStatus, btnIconRefs.current)
    }
  }, [btnsStatus])

  useEffect(() => {
    getCards('reboot')
    if (infoAddFullCard) {
      const timerIcon = setTimeout(() => {
        dispatch(addFullCard(false))
      }, 300)

      return () => clearTimeout(timerIcon)
    }
  }, [infoAddFullCard, dispatch])

  const handleClickShopping = async () => {
    // const cards = await getCards('shopping')
    dispatch(choiceClip(infoChoiceClip === 'shopping' ? false : 'shopping'))
  }

  return (
    <div className="status-container">
      {listBtnsStatus.map((btn, i) => (
        <button
          className={`toolbar-btn toolbar-btn-${btn}`}
          key={`${btn}-${i}`}
          ref={setBtnIconRef(`status-${btn}`)}
          onClick={handleClickShopping}
        >
          <MdOutlineShoppingCart className="toolbar-status-icon" />
          {btn === 'shopping' ? (
            <span className="shopping-counter-container">
              <span className="shopping-counter">{countCards}</span>
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
