import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Toolbar from './Toolbar/Toolbar'
import ToolbarDate from './Toolbar/ToolbarDate/ToolbarDate'
import './CardFormNav.scss'

const CardFormNav = ({
  name,
  sizeCard,
  toolbarColor,
  setToolbarColorActive,
  // handleClickBtnNav,
  // handleClickColor,
  setCardFormNav,
}) => {
  const sections = useSelector((state) => state.cardEdit)
  const sectionDate = sections.date

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
            // handleClickBtnNav={handleClickBtnNav}
          />
        )
      case 'Date':
        if (sectionDate) {
          return
        } else {
          return <ToolbarDate />
        }

      default:
        break
    }
  }

  return (
    <div
      ref={cardFormNavRef}
      className="card-form-nav"
      style={{ width: `${sizeCard && sizeCard.width}px` }}
    >
      {section(name)}
    </div>
  )
}

export default CardFormNav
