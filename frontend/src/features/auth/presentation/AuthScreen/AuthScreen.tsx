import React from 'react'
import { LoginForm } from './LoginForm'
import styles from './AuthScreen.module.scss'

export const AuthScreen: React.FC = () => {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Hidragonfly.com</h1>
          <p className={styles.subtitle}>Sign in to continue editing postcards</p>
        </div>
        <LoginForm />
        <p className={styles.hint}>
          Mock auth is enabled. Dev login uses <code>dev@hi.com</code> /{' '}
          <code>dev123456</code>.
        </p>
      </div>
    </div>
  )
}
