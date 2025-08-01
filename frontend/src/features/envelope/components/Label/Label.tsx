import React from 'react'
import './Label.scss'
import { EnvelopeValues } from '@features/envelope/envelope.types'

interface LabelProps {
  name: string
  field: keyof EnvelopeValues
  values: EnvelopeValues
  handleValue: (
    field: keyof EnvelopeValues,
    shortName: string,
    value: string
  ) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (inputKey: string) => React.Ref<HTMLInputElement>
}

const Label: React.FC<LabelProps> = ({
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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
      <>
        <span className="label-element-space"></span>
        <span>{nameWithoutIndex}</span>
        <span className="label-element-space"></span>
      </>
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
      />
    </label>
  )
}

export default Label
