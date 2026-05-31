import React from 'react'
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
      <svg
        className={styles.passwordToggleIcon}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M3 3l18 18M10.58 10.58A2 2 0 0 0 12 15a2 2 0 0 0 1.42-.58M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-1.67 2.95M6.61 6.61A11.8 11.8 0 0 0 1 11.5C2.73 15.89 7 19 12 19a10.9 10.9 0 0 0 4.12-.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        className={styles.passwordToggleIcon}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    )}
  </button>
)
