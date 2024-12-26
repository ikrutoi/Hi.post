import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'

const CardForm = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  return (
    <div className="card-form">
      <CardPuzzle
        name={name}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
    </div>
  )
}

export default CardForm
