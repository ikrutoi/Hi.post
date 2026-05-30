import React from 'react'
import clsx from 'clsx'
import { LoginForm } from '../AuthScreen/LoginForm'
import { RegisterForm } from '../AuthScreen/RegisterForm'
import styles from './UserLoginPanel.module.scss'

export type GuestAuthMode = 'signIn' | 'register'

type GuestAuthSectionProps = {
  mode: GuestAuthMode
  onModeChange: (mode: GuestAuthMode) => void
}

export const GuestAuthSection: React.FC<GuestAuthSectionProps> = ({
  mode,
  onModeChange,
}) => (
  <>
    <p className={styles.guestHint}>
      You can edit postcards and view local history without an account. Sign in
      to sync across devices and back up your work.
    </p>

    <div
      className={styles.authModeSwitch}
      role="tablist"
      aria-label="Account access"
    >
      <button
        type="button"
        role="tab"
        className={clsx(
          styles.authModeButton,
          mode === 'signIn' && styles.authModeButtonActive,
        )}
        aria-selected={mode === 'signIn'}
        onClick={() => onModeChange('signIn')}
      >
        Sign in
      </button>
      <button
        type="button"
        role="tab"
        className={clsx(
          styles.authModeButton,
          mode === 'register' && styles.authModeButtonActive,
        )}
        aria-selected={mode === 'register'}
        onClick={() => onModeChange('register')}
      >
        Create account
      </button>
    </div>

    <div role="tabpanel">
      {mode === 'signIn' ? <LoginForm /> : <RegisterForm />}
    </div>
  </>
)
