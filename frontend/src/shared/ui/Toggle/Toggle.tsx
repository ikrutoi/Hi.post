import React from 'react'
import clsx from 'clsx'
import styles from './Toggle.module.scss'

type ToggleProps = {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  size?: 'small' | 'default' | 'large'
  variant?: 'default' | 'envelope' | 'envelopeSender' | 'envelopeRecipient'
  disabled?: boolean
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  size = 'default',
  variant = 'default',
  disabled = false,
}) => {
  return (
    <label
      className={clsx(
        styles.toggleLabel,
        styles[`toggle${size[0].toUpperCase() + size.slice(1)}`],
        variant === 'envelope' && styles.toggleEnvelope,
        variant === 'envelopeSender' && styles.toggleEnvelopeSender,
        variant === 'envelopeRecipient' && styles.toggleEnvelopeRecipient,
        disabled && styles.toggleDisabled,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={styles.toggleInput}
      />
      <span className={styles.toggleSlider} />
      <span className={styles.toggleText}>{label}</span>
    </label>
  )
}
