import './AromaElement.scss'

const AromaElement = ({ make, name }) => {
  return (
    <div className="aroma-element">
      <span>{make}</span>
      <span>{name}</span>
    </div>
  )
}

export default AromaElement
