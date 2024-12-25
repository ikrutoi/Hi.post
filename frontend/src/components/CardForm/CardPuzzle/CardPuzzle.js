import './CardPuzzle.scss'
import sizeCard from '../../../data/ratioCardCardMini.json'
import Cardphoto from './Cardphoto/Cardphoto'
import Cardtext from './Cardtext/Cardtext'
import Envelope from './Envelope/Envelope'
import Aroma from './Aroma/Aroma'
import Date from './Date/Date'

const CardPuzzle = ({ name, dimensionHeight, dimensionWidth }) => {
  const heightCard = dimensionHeight * sizeCard.card
  const widthCard = heightCard * 1.42

  const section = (name) => {
    switch (name) {
      case 'Cardphoto':
        return <Cardphoto />
      case 'Cardtext':
        return <Cardtext />
      case 'Envelope':
        return <Envelope />
      case 'Aroma':
        return <Aroma />
      case 'Date':
        return <Date />
      default:
        break
    }
  }

  console.log(name)

  return (
    <div
      className="card-puzzle"
      style={{ width: `${widthCard}px`, height: `${heightCard}px` }}
    >
      {section(name)}
    </div>
  )
}

export default CardPuzzle
