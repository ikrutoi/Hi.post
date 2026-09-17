import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectAutoBackupPending,
  selectLastAutoBackupAt,
} from '../infrastructure/selectors/postcardSyncSelectors'
import styles from './CloudBackupStatus.module.scss'

function formatSyncDate(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Phase 4: per-postcard /v2 sync. Snapshot backup UI is retired. */
export const CloudBackupStatus: React.FC = () => {
  const autoBackupPending = useAppSelector(selectAutoBackupPending)
  const lastAutoBackupAt = useAppSelector(selectLastAutoBackupAt)

  const message = useMemo(() => {
    if (autoBackupPending) return 'Syncing postcards…'
    const syncedLabel = formatSyncDate(lastAutoBackupAt)
    if (syncedLabel) return `Postcards sync across devices · last sync ${syncedLabel}`
    return 'Postcards sync across devices when you are signed in.'
  }, [autoBackupPending, lastAutoBackupAt])

  if (import.meta.env.VITE_AUTH_MODE !== 'http') {
    return null
  }

  return (
    <div className={styles.root}>
      <p
        className={styles.status}
        aria-live="polite"
        data-status={autoBackupPending ? 'loading' : 'succeeded'}
      >
        {message}
      </p>
    </div>
  )
}
