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
  const [btnNav, setBtnNav] = useState(null)
  const [cardFormNav, setCardFormNav] = useState(null)
  const [heightCardForm, setHeightCardForm] = useState(null)
  const cardFormRef = useRef(null)
  // const cardFormNavRef = useRef(null)

  useEffect(() => {
    if (cardFormNav) {
      setHeightCardForm(
        cardFormRef.current.clientHeight - cardFormNav.clientHeight
      )
    }
  }, [cardFormRef, cardFormNav])

  // useEffect(() => {
  //   console.log('heightForm', heightCardForm)
  // }, [heightCardForm])

  return (
    <div className="card-form" ref={cardFormRef}>
      <CardFormNav
        setCardFormNav={setCardFormNav}
        name={name}
        // dimensionHeight={dimensionHeight}
        toolbarColor={toolbarColor}
        setToolbarColorActive={setToolbarColorActive}
        handleClickBtnNav={setBtnNav}
        heightCardForm={heightCardForm}
        // handleClickColor={handleClickColor}
      />
      <CardPuzzle
        name={name}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
        toolbarColor={toolbarColor}
        heightCardForm={heightCardForm}
        // setToolbarColorActive={setToolbarColorActive}
        choiceBtnNav={btnNav}
      />
    </div>
  )
}

export default CardForm
