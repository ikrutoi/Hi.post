import React from 'react'
import './Label.scss'
import type { LabelProps } from '@features/envelope/types'

export const Label: React.FC<LabelProps> = ({
  label,
  field,
  role,
  values,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
}) => {
  const indexName = label.split('-')[0]

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    const value = e.target.value
    const isIndexField =
      e.target.className.includes('sender-index') ||
      e.target.className.includes('recipient-index')
    const sanitizedValue = isIndexField ? value.replace(/\D/g, '') : value
    handleValue(role, field, sanitizedValue)
  }

  return (
    <label className={`envelope-label envelope-label-${field}`}>
      <>
        <span className="label-element-space"></span>
        <span>{label}</span>
        <span className="label-element-space"></span>
      </>
      <input
        className={`envelope-input ${role} ${role}-${field}`}
        ref={setInputRef(`${role}${indexName}`)}
        data-role={role}
        data-index={indexName}
        data-name={field}
        type="text"
        value={values[role][field]}
        onChange={handleChange}
        onKeyDown={handleMovingBetweenInputs}
      />
    </label>
  )
}
