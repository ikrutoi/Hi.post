import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardFormNav from './CardFormNav/CardFormNav'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addRemSize, addSizeCard } from '../../redux/layout/actionCreators'

const CardForm = ({
  name,
  hover,
  dimensionHeight,
  dimensionWidth,
  toolbarColor,
  setToolbarColorActive,
}) => {
  // const [btnNav, setBtnNav] = useState(null)
  const [cardFormNav, setCardFormNav] = useState(null)
  const [sizeCard, setSizeCard] = useState(null)
  const cardFormRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (cardFormNav) {
      const height = cardFormRef.current.clientHeight - cardFormNav.clientHeight
      const width = +(height * 1.42).toFixed(2)
      setSizeCard({ height, width })
      dispatch(addSizeCard({ width, height }))
    }
  }, [cardFormRef, cardFormNav, dispatch])

  // const [remSize, setRemSize] = useState(null)

  useEffect(() => {
    const root = document.documentElement
    const remSizeInPx = getComputedStyle(root).getPropertyValue('--rem-size')
    const tempDiv = document.createElement('div')
    tempDiv.style.width = remSizeInPx
    tempDiv.style.visibility = 'hidden'
    document.body.appendChild(tempDiv)
    const computedRem = tempDiv.getBoundingClientRect().width
    // setRemSize(computedRem)
    dispatch(addRemSize(computedRem))
    document.body.removeChild(tempDiv)
  }, [])

  return (
    <div className="card-form" ref={cardFormRef}>
      <CardFormNav
        setCardFormNav={setCardFormNav}
        name={name}
        toolbarColor={toolbarColor}
        setToolbarColorActive={setToolbarColorActive}
        // handleClickBtnNav={setBtnNav}
        sizeCard={sizeCard}
        // handleClickColor={handleClickColor}
      />
      <CardPuzzle
        name={name}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
        toolbarColor={toolbarColor}
        sizeCard={sizeCard}
        // setToolbarColorActive={setToolbarColorActive}
        // choiceBtnNav={btnNav}
      />
    </div>
  )
}

export default CardForm
