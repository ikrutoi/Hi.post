import React from 'react'
import './Label.scss'

const Label = ({
  name,
  field,
  values,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
}) => {
  const indexName = name.split('-')[0]
  const nameWithoutIndex = name.split('-')[1]
  const shortName = nameWithoutIndex.split(' / ')[0].toLowerCase()

  const handleChange = (e) => {
    e.preventDefault()
    const { value } = e.target
    if (
      e.target.className.includes('myaddress-index') ||
      e.target.className.includes('toaddress-index')
    ) {
      const numericValue = value.replace(/\D/g, '')
      handleValue(field, shortName, numericValue)
    } else {
      handleValue(field, shortName, value)
    }
  }

  return (
    <label className={`envelope-label envelope-label-${shortName}`}>
      {
        <>
          <span className="label-element-space"></span>
          <span>{nameWithoutIndex}</span>
          <span className="label-element-space"></span>
        </>
      }
      <input
        className={`envelope-input ${field} ${field}-${shortName}`}
        ref={setInputRef(`${field}${indexName}`)}
        data-field={field}
        data-index={indexName}
        data-name={shortName}
        type="text"
        value={values[field][shortName]}
        onChange={handleChange}
        onKeyDown={handleMovingBetweenInputs}
      ></input>
    </label>
  )
}

export default Label
