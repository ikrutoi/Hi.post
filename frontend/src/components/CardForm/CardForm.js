import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardFormNav from './CardFormNav/CardFormNav'

const CardForm = () => {
  return (
    <div className="card-form">
      <CardFormNav />
      <CardPuzzle />
    </div>
  )
}

export default CardForm
