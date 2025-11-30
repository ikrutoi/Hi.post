import React from 'react'
import clsx from 'clsx'
import styles from './Label.module.scss'
import type {
  AddressFields,
  AddressFieldLabel,
  EnvelopeRole,
  EnvelopeRoleLabel,
} from '@shared/config/constants'

interface LabelProps {
  role: EnvelopeRole
  roleLabel: EnvelopeRoleLabel
  label: AddressFieldLabel
  field: keyof AddressFields
  value: string
  // value: string
  index: number
  onValueChange: (field: keyof AddressFields, value: string) => void
  // onInputNavigation: React.KeyboardEventHandler<HTMLInputElement>
  // setInputRef: (id: string) => React.RefCallback<HTMLInputElement>
}

export const Label: React.FC<LabelProps> = ({
  role,
  roleLabel,
  label,
  field,
  value,
  index,
  onValueChange,
  // onInputNavigation,
  // setInputRef,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value
    const sanitizeInput = (
      field: keyof AddressFields,
      value: string
    ): string => {
      if (field === 'zip') return value.replace(/\D/g, '')
      return value
    }
    const sanitized = sanitizeInput(field, raw)
    onValueChange(field, sanitized)
  }
  const refKey = `${role}-${field}-${index}`

  return (
    <label
      className={clsx(
        styles.label,
        styles[`label${roleLabel}`],
        styles[`label${label}`]
      )}
    >
      <span className={styles.labelSpacer} />
      <span className={styles.labelText}>{label}</span>
      <span className={styles.labelSpacer} />
      <input
        className={clsx(
          styles.labelInput,
          styles[`labelInput${roleLabel}`],
          styles[`labelInput${label}`]
        )}
        // ref={setInputRef(refKey)}
        type="text"
        value={value}
        onChange={handleChange}
        // onKeyDown={onInputNavigation}
      />
    </label>
  )
}
