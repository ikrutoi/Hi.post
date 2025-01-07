import './Label.scss'

const Label = ({
  name,
  valueToAddress,
  handleValueToAddress,
  valueMyAddress,
  handleValueMyAddress,
}) => {
  const shortName = name.split(' / ')[0].toLowerCase()
  const validationHandleValueAddress = (e) => {
    e.preventDefault()
    if (handleValueMyAddress) {
      handleValueMyAddress(shortName, e.target.value)
    }
    if (handleValueToAddress) {
      handleValueToAddress(shortName, e.target.value)
    }
  }
  const validationValueAddress = () => {
    if (valueMyAddress) {
      return valueMyAddress[shortName]
    }
    if (valueToAddress) {
      return valueToAddress[shortName]
    }
  }
  return (
    <label className="envelope-label">
      {name}
      <input
        className={`envelope-input ${
          valueMyAddress ? `my-address-${shortName}` : ''
        } ${valueToAddress ? `to-address-${shortName}` : ''}`}
        value={validationValueAddress()}
        onChange={(e) => validationHandleValueAddress(e)}
        type="text"
      ></input>
    </label>
  )
}

export default Label
