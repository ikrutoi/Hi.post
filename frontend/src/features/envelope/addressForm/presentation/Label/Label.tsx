import React from 'react'
import './Label.scss'
import type { LabelProps } from './Label.types'

export const Label: React.FC<LabelProps> = ({
  label,
  field,
  role,
  values,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
}) => {
  const index = label.split('-')[0]

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value
    const isIndexField = field === 'zip'
    const sanitized = isIndexField ? raw.replace(/\D/g, '') : raw
    handleValue(role, field, sanitized)
  }

  return (
    <label className={`label label--${field}`}>
      <span className="label__spacer" />
      <span className="label__text">{label}</span>
      <span className="label__spacer" />
      <input
        className={`label__input label__input--${role} label__input--${field}`}
        ref={setInputRef(`${role}${index}`)}
        data-role={role}
        data-index={index}
        data-name={field}
        type="text"
        value={values[role][field]}
        onChange={handleChange}
        onKeyDown={handleMovingBetweenInputs}
      />
    </label>
  )
}
