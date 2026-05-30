import React, { useState } from 'react'
import { z } from 'zod'
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

const registerFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters'),
})

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const parsed = registerFormSchema.safeParse({ name, email, password })
    if (!parsed.success) {
      dispatch(setAuthError(parsed.error.issues[0]?.message ?? 'Invalid input'))
      return
    }

    dispatch(loginStart())
    void getAuthRepository()
      .register(parsed.data)
      .then((session) => {
        dispatch(setAuth(session))
      })
      .catch((err) => {
        dispatch(
          setAuthError(
            err instanceof Error ? err.message : 'Registration failed',
          ),
        )
      })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Name</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input
          className={styles.input}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Password</span>
        <div className={styles.passwordField}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
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
        </div>
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button className={styles.primaryButton} type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
