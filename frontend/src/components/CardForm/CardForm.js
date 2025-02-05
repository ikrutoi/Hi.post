import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardFormNav from './CardFormNav/CardFormNav'

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
      <CardFormNav
        name={name}
        dimensionHeight={dimensionHeight}
        toolbarColor={toolbarColor}
        setToolbarColorActive={setToolbarColorActive}
      />
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
