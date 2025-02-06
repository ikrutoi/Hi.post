import './CardFormNav.scss'
// import sizeCard from '../../../data/ratioCardCardMini.json'
import { useEffect, useRef } from 'react'
import ToolbarCardtext from './ToolbarCardtext/ToolbarCardtext'

const CardFormNav = ({
  name,
  heightCardForm,
  toolbarColor,
  setToolbarColorActive,
  handleClickBtnNav,
  // handleClickColor,
  setCardFormNav,
}) => {
  // const heightCard = heightCardForm * sizeCard.card
  const widthCard = heightCardForm * 1.42

  const cardFormNavRef = useRef(null)

  useEffect(() => {
    if (cardFormNavRef.current) {
      setCardFormNav(cardFormNavRef.current)
    }
  }, [cardFormNavRef, setCardFormNav])

  const section = (name) => {
    switch (name) {
      // case 'Cardphoto':
      // return <ToolbarCardphoto />
      case 'Cardtext':
        return (
          <ToolbarCardtext
            toolbarColor={toolbarColor}
            setToolbarColorActive={setToolbarColorActive}
            handleClickBtnNav={handleClickBtnNav}
            // handleClickColor={handleClickColor}
          />
        )
      default:
        break
    }
  }

  return (
    <div
      ref={cardFormNavRef}
      className="card-form-nav"
      style={{ width: `${widthCard}px` }}
    >
      {section(name)}
    </div>
  )
}

export default CardFormNav
