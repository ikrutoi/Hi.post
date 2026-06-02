import React from 'react'
import { IconEye, IconEyeInvisible } from '@shared/ui/icons'
import styles from './LoginForm.module.scss'

type PasswordVisibilityToggleProps = {
  showPassword: boolean
  onToggle: () => void
  fieldLabel?: string
}

export const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  showPassword,
  onToggle,
  fieldLabel = 'password',
}) => (
  <button
    type="button"
    className={styles.passwordToggle}
    aria-label={
      showPassword ? `Hide ${fieldLabel}` : `Show ${fieldLabel}`
    }
    aria-pressed={showPassword}
    onClick={onToggle}
  >
    {showPassword ? (
      <IconEyeInvisible
        className={styles.passwordToggleIcon}
        aria-hidden
      />
    ) : (
      <IconEye className={styles.passwordToggleIcon} aria-hidden />
    )}
  </button>
)
