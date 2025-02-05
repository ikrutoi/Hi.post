import './CardFormNav.scss'
import sizeCard from '../../../data/ratioCardCardMini.json'
import { useEffect, useRef } from 'react'
import CardFormNavCardphoto from './CardFormNavCardphoto/CardFormNavCardphoto'
import CardFormNavCardtext from './CardFormNavCardtext/CardFormNavCardtext'

const CardFormNav = ({
  name,
  dimensionHeight,
  toolbarColor,
  setToolbarColorActive,
  handleClickBtnNav,
  // handleClickColor,
  setCardFormNav,
}) => {
  const heightCard = dimensionHeight * sizeCard.card
  const widthCard = heightCard * 1.42

  const cardFormNavRef = useRef(null)

  useEffect(() => {
    if (cardFormNavRef.current) {
      setCardFormNav(cardFormNavRef.current)
    }
  }, [cardFormNavRef, setCardFormNav])

  const section = (name) => {
    switch (name) {
      case 'Cardphoto':
        return <CardFormNavCardphoto />
      case 'Cardtext':
        return (
          <CardFormNavCardtext
            toolbarColor={toolbarColor}
            setToolbarColorActive={setToolbarColorActive}
            handleClickBtnNav={handleClickBtnNav}
            // handleClickColor={handleClickColor}
          />
        )
      // case 'Envelope':
      //   return <Envelope cardPuzzleRef={cardPuzzleRef.current} />
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
