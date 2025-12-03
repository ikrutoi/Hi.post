import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Label.module.scss'
import type { AddressFields } from '@shared/config/constants'

type LabelProps = {
  role: string
  roleLabel: string
  label: string
  field: keyof AddressFields
  value: string
  onValueChange: (field: keyof AddressFields, value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const Label = forwardRef<HTMLInputElement, LabelProps>(
  ({ role, roleLabel, label, field, value, onValueChange, onKeyDown }, ref) => {
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
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
      </label>
    )
  }
)
