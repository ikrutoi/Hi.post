import React from 'react'
import styles from './Label.module.scss'
import type { AddressField, AddressRole } from '@envelope/domain/types'

interface LabelProps {
  label: string
  field: AddressField
  role: AddressRole
  value: string
  index: string
  handleValue: (role: AddressRole, field: AddressField, value: string) => void
  handleMovingBetweenInputs: React.KeyboardEventHandler<HTMLInputElement>
  setInputRef: (id: string) => React.RefCallback<HTMLInputElement>
}

export const Label: React.FC<LabelProps> = ({
  label,
  field,
  role,
  value,
  index,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value
    const sanitized = field === 'zip' ? raw.replace(/\D/g, '') : raw
    handleValue(role, field, sanitized)
  }

  return (
    <label className={`${styles.label} ${styles[`label--${field}`]}`}>
      <span className={styles.label__spacer} />
      <span className={styles.label__text}>{label}</span>
      <span className={styles.label__spacer} />
      <input
        className={`${styles.label__input} ${styles[`label__input--${role}`]} ${styles[`label__input--${field}`]}`}
        ref={setInputRef(`${role}${index}`)}
        data-role={role}
        data-index={index}
        data-name={field}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleMovingBetweenInputs}
      />
    </label>
  )
}
