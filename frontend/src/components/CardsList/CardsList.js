import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import './CardsList.scss'

const CardsList = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  return (
    <div className="cards-list">
      <CardMiniPuzzle
        hover={hover}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
    </div>
  )
}

export default CardsList
