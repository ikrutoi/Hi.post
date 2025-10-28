import React from 'react'
import styles from './Label.module.scss'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'

interface LabelProps {
  label: string
  field: keyof AddressFields
  role: EnvelopeRole
  valueRole: string
  index: number
  handleValue: (
    role: EnvelopeRole,
    field: keyof AddressFields,
    valueRole: string
  ) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (id: string) => React.RefCallback<HTMLInputElement>
}

export const Label: React.FC<LabelProps> = ({
  label,
  field,
  role,
  valueRole,
  index,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value
    const sanitizeInput = (
      field: keyof AddressFields,
      valueRole: string
    ): string => {
      if (field === 'zip') return valueRole.replace(/\D/g, '')
      return valueRole
    }
    const sanitized = sanitizeInput(field, raw)
    handleValue(role, field, sanitized)
  }
  const refKey = `${role}-${field}-${index}`

  return (
    <label className={`${styles.label} ${styles[`label--${field}`]}`}>
      <span className={styles.label__spacer} />
      <span className={styles.label__text}>{label}</span>
      <span className={styles.label__spacer} />
      <input
        className={`${styles.label__input} ${styles[`label__input--${role}`]} ${styles[`label__input--${field}`]}`}
        ref={setInputRef(refKey)}
        data-role={role}
        data-index={index}
        data-name={field}
        type="text"
        value={valueRole}
        onChange={handleChange}
        onKeyDown={handleMovingBetweenInputs}
      />
    </label>
  )
}
