import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardFormNav from './CardFormNav/CardFormNav'
import { useEffect, useRef, useState } from 'react'

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

  useEffect(() => {
    if (cardFormNav) {
      const height = cardFormRef.current.clientHeight - cardFormNav.clientHeight
      const width = +(height * 1.42).toFixed(2)
      setSizeCard({ height, width })
    }
  }, [cardFormRef, cardFormNav])

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
