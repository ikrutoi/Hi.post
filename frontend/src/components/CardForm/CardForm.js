import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardFormNav from './CardFormNav/CardFormNav'

const CardForm = ({ toolbarColor, setToolbarColorActive }) => {
  return (
    <div className="card-form">
      <CardFormNav
        toolbarColor={toolbarColor}
        setToolbarColorActive={setToolbarColorActive}
      />
      <CardPuzzle toolbarColor={toolbarColor} />
    </div>
  )
}

export default CardForm
