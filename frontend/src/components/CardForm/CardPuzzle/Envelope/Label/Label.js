import './Label.scss'

const Label = ({ name }) => {
  return (
    <label className="envelope-label">
      {name}
      <input className="envelope-input" type="text"></input>
    </label>
  )
}

export default Label
