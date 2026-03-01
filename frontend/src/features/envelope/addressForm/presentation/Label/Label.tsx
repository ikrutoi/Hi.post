import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'
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
      const sanitized = field === 'zip' ? raw.replace(/\D/g, '') : raw
      onValueChange(field, sanitized)
    }

    const handleClear = () => {
      onValueChange(field, '')
    }

    return (
      <label
        className={clsx(
          styles.label,
          styles[`label${roleLabel}`],
          styles[`label${label}`],
        )}
      >
        <span className={styles.labelSpacer} />
        <span className={styles.labelText}>{label}</span>
        <span className={styles.labelSpacer} />

        <div
          className={clsx(
            styles.inputWrapper,
            styles[`inputWrapper${roleLabel}`],
          )}
        >
          <input
            className={clsx(
              styles.labelInput,
              styles[`labelInput${roleLabel}`],
              styles[`labelInput${label}`],
            )}
            ref={ref}
            type="text"
            value={value}
            aria-label={label}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          {value.trim() !== '' && (
            <button
              type="button"
              className={clsx(styles.clearButton)}
              onClick={handleClear}
            >
              {getToolbarIcon({ key: 'clearInput' })}
            </button>
          )}
        </div>
      </label>
    )
  },
)
