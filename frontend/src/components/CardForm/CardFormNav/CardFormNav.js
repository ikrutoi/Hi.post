import './CardFormNav.scss'
import { useEffect, useRef } from 'react'
import Toolbar from './Toolbar/Toolbar'
import ToolbarDate from './Toolbar/ToolbarDate/ToolbarDate'

const CardFormNav = ({
  name,
  sizeCard,
  toolbarColor,
  setToolbarColorActive,
  handleClickBtnNav,
  // handleClickColor,
  setCardFormNav,
}) => {
  // const heightCard = heightCardForm * sizeCard.card
  // const widthCard = heightCard * 1.42

  const cardFormNavRef = useRef(null)

  useEffect(() => {
    if (cardFormNavRef.current) {
      setCardFormNav(cardFormNavRef.current)
    }
  }, [cardFormNavRef, setCardFormNav])

  const section = (name) => {
    switch (name) {
      case 'Cardphoto':
        return <Toolbar nameSection={name.toLowerCase()} />
      case 'Cardtext':
        return (
          <Toolbar
            nameSection={name.toLowerCase()}
            toolbarColor={toolbarColor}
            setToolbarColorActive={setToolbarColorActive}
            handleClickBtnNav={handleClickBtnNav}
          />
        )
      case 'Date':
        return <ToolbarDate />
      default:
        break
    }
  }

  return (
    <div
      ref={cardFormNavRef}
      className="card-form-nav"
      style={{ width: `${sizeCard.width}px` }}
    >
      {section(name)}
    </div>
  )
}

export default CardFormNav
