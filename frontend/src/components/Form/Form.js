import FormPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import './Form.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'

const Form = ({ name }) => {
  return (
    <div className="form">
      <div className="form-list">
        <FormPuzzle />
      </div>
      <div className="form-down">
        <CardPuzzle name={name} />
      </div>
    </div>
  )
}

export default Form
