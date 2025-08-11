import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Status.scss'
import {
  setFullCard,
  setChoiceClip,
  setShoppingCards,
} from '@store/slices/layoutSlice'
import {
  getAllBlanks,
  getAllShopping,
} from '../../utils/cardFormNav/indexDB/indexDb'
import { changeIconStyles } from '../../data/toolbar/changeIconStyles'
import { addIconToolbar } from '../../data/toolbar/getIconElement'
import type { RootState } from '../../store'
import type { StatusType } from '../../types/layout'

const Status = () => {
  const dispatch = useDispatch()
  const selectorIBStatus = useSelector(
    (state: RootState) => state.infoButtons.status
  )
  const selectorLayoutAddFullCard = useSelector(
    (state: RootState) => state.layout.fullCard
  )
  const selectorLayoutChoiceClip = useSelector(
    (state: RootState) => state.layout.choiceClip
  )
  const selectorLayoutShoppingCards = useSelector(
    (state: RootState) => state.layout.shoppingCards
  )
  const maxCardsList = useSelector(
    (state: RootState) => state.layout.maxCardsList
  )

  const [btnsStatus, setBtnsStatus] = useState<{ status: StatusType }>({
    status: {
      ...selectorIBStatus,
      clip: false,
      clipId: '',
    },
  })

  const [countShopping, setCountShopping] = useState<number | null>(null)
  const [countBlanks, setCountBlanks] = useState<number | null>(null)
  const listBtnsStatus: Array<'shopping' | 'clip' | 'user'> = [
    'shopping',
    'clip',
    'user',
  ]

  const btnIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const setBtnIconRef = (id: string) => (element: HTMLButtonElement | null) => {
    btnIconRefs.current[id] = element
  }

  const updateStatus = async () => {
    const shoppings = await getAllShopping()
    const blanks = await getAllBlanks()
    setBtnsStatus((prev) => ({
      ...prev,
      status: {
        ...prev.status,
        shopping: Boolean(shoppings.length),
        clip: Boolean(blanks.length),
      },
    }))
    setCountShopping(shoppings.length || 0)
    setCountBlanks(blanks.length || 0)

    if (shoppings.length > 0 && !selectorLayoutShoppingCards) {
      dispatch(setShoppingCards(true))
    }
    if (shoppings.length === 0 && selectorLayoutShoppingCards) {
      dispatch(setShoppingCards(false))
    }
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
    if (selectorLayoutAddFullCard) {
      const timerIcon = setTimeout(() => {
        dispatch(setFullCard(false))
      }, 300)
      return () => clearTimeout(timerIcon)
    }
  }, [selectorLayoutAddFullCard, dispatch])

  const handleClickBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const parentBtn = (evt.target as HTMLElement).closest(
      '.toolbar-btn'
    ) as HTMLButtonElement
    const tooltip = parentBtn.dataset.tooltip

    if (!tooltip) return

    switch (tooltip) {
      case 'shopping':
        dispatch(
          setChoiceClip(
            selectorLayoutChoiceClip === 'shopping' ? null : 'shopping'
          )
        )
        break
      case 'clip':
      case 'user':
        dispatch(
          setChoiceClip(selectorLayoutChoiceClip === 'blanks' ? null : 'blanks')
        )
        break
      default:
        break
    }
  }

  return (
    <div className="status-container">
      <div className="status-container-cards">
        {listBtnsStatus.map((btn, i) => (
          <button
            key={`${btn}-${i}`}
            className={`toolbar-btn toolbar-btn-${btn}`}
            data-tooltip={btn}
            ref={setBtnIconRef(`status-${btn}`)}
            onClick={handleClickBtn}
          >
            {addIconToolbar(btn)}
            {btn === 'shopping' && countShopping ? (
              <span
                className={`counter-container status-counter-container ${btn}-counter-container`}
              >
                <span className={`status-counter ${btn}-counter`}>
                  {countShopping}
                </span>
              </span>
            ) : null}
            {btn === 'clip' && countBlanks ? (
              <span
                className={`counter-container status-counter-container ${btn}-counter-container`}
              >
                <span className={`status-counter ${btn}-counter`}>
                  {countBlanks}
                </span>
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="status-user">
        <span className="status-user-img" />
      </div>
    </div>
  )
}

export default Status
