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
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((value) => !value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const parsed = registerFormSchema.safeParse({ name, email, password })
    if (!parsed.success) {
      dispatch(setAuthError(parsed.error.issues[0]?.message ?? 'Invalid input'))
      return
    }

    if (parsed.data.password !== confirmPassword.trim()) {
      dispatch(setAuthError('Passwords do not match'))
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
          <PasswordVisibilityToggle
            showPassword={showPassword}
            onToggle={togglePasswordVisibility}
          />
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Confirm password</span>
        <div className={styles.passwordField}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            autoComplete="off"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <PasswordVisibilityToggle
            showPassword={showPassword}
            onToggle={togglePasswordVisibility}
            fieldLabel="confirm password"
          />
        </div>
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button className={styles.primaryButton} type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
