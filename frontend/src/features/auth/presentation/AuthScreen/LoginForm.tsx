import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { getAuthRepository } from '@features/auth/infrastructure/authRepository'
import {
  loginStart,
  setAuth,
  setAuthError,
} from '@features/auth/infrastructure/state/auth.slice'
import {
  selectAuthError,
  selectAuthLoading,
} from '@features/auth/infrastructure/selectors/authSelectors'
import styles from './LoginForm.module.scss'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

const DEV_LOGIN = {
  email: 'dev@hi.com',
  password: 'dev123456',
} as const

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submitLogin = async (payload: { email: string; password: string }) => {
    dispatch(loginStart())
    try {
      const session = await getAuthRepository().login({
        email: payload.email.trim(),
        password: payload.password.trim(),
      })
      dispatch(setAuth(session))
    } catch (err) {
      dispatch(
        setAuthError(err instanceof Error ? err.message : 'Login failed'),
      )
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    void submitLogin({ email, password })
  }

  const handleDevLogin = () => {
    setEmail(DEV_LOGIN.email)
    setPassword(DEV_LOGIN.password)
    void submitLogin(DEV_LOGIN)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Password</span>
        <div className={styles.passwordField}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <PasswordVisibilityToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
          />
        </div>
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button className={styles.primaryButton} type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      {import.meta.env.DEV ? (
        <button
          className={styles.secondaryButton}
          type="button"
          disabled={loading}
          onClick={handleDevLogin}
        >
          Dev login
        </button>
      ) : null}
    </form>
  )
}
