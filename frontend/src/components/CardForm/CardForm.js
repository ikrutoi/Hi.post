import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'

const CardForm = ({
  name,
  hover,
  dimensionHeight,
  dimensionWidth,
  toolbarColor,
  setToolbarColorActive,
}) => {
  return (
    <div className="card-form">
      <CardPuzzle
        name={name}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
        toolbarColor={toolbarColor}
        setToolbarColorActive={setToolbarColorActive}
      />
    </div>
  )
}

export default CardForm
