import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCloudBackup,
  selectCloudBackupError,
  selectCloudBackupFetchStatus,
  selectCloudBackupPostcardCount,
  selectCloudBackupRestoreError,
  selectCloudBackupRestoreStatus,
  selectCloudBackupUploadError,
  selectCloudBackupUploadStatus,
  selectHasCloudBackup,
} from '../infrastructure/selectors/postcardSyncSelectors'
import {
  clearCloudBackupError,
  restoreCloudBackupThunk,
  uploadCloudBackupThunk,
} from '../store'
import styles from './CloudBackupStatus.module.scss'

function formatBackupDate(value: string | null | undefined): string | null {
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

export const CloudBackupStatus: React.FC = () => {
  const dispatch = useAppDispatch()
  const fetchStatus = useAppSelector(selectCloudBackupFetchStatus)
  const uploadStatus = useAppSelector(selectCloudBackupUploadStatus)
  const restoreStatus = useAppSelector(selectCloudBackupRestoreStatus)
  const cloudBackup = useAppSelector(selectCloudBackup)
  const hasCloudBackup = useAppSelector(selectHasCloudBackup)
  const postcardCount = useAppSelector(selectCloudBackupPostcardCount)
  const fetchError = useAppSelector(selectCloudBackupError)
  const uploadError = useAppSelector(selectCloudBackupUploadError)
  const restoreError = useAppSelector(selectCloudBackupRestoreError)

  const isBusy =
    fetchStatus === 'loading' ||
    uploadStatus === 'loading' ||
    restoreStatus === 'loading'

  const message = useMemo(() => {
    if (restoreStatus === 'loading') {
      return 'Restoring cloud backup…'
    }

    if (uploadStatus === 'loading') {
      return 'Saving cloud backup…'
    }

    if (fetchStatus === 'loading' || fetchStatus === 'idle') {
      return 'Checking cloud backup…'
    }

    if (fetchStatus === 'failed') {
      return fetchError ?? 'Could not check cloud backup.'
    }

    if (restoreStatus === 'succeeded') {
      return 'Local postcards were replaced with the cloud backup.'
    }

    if (!cloudBackup) {
      return 'No cloud backup yet.'
    }

    const updatedLabel = formatBackupDate(cloudBackup.updatedAt)
    const countLabel =
      postcardCount === 1 ? '1 postcard' : `${postcardCount} postcards`

    return updatedLabel
      ? `Cloud backup: ${countLabel} · updated ${updatedLabel}`
      : `Cloud backup: ${countLabel}`
  }, [
    cloudBackup,
    fetchError,
    fetchStatus,
    postcardCount,
    restoreStatus,
    uploadStatus,
  ])

  const handleBackup = useCallback(() => {
    dispatch(clearCloudBackupError())
    void dispatch(uploadCloudBackupThunk())
  }, [dispatch])

  const handleRestore = useCallback(() => {
    if (!hasCloudBackup) return

    const confirmed = window.confirm(
      'Replace local postcards with the cloud backup? This will overwrite postcards stored on this device.',
    )
    if (!confirmed) return

    dispatch(clearCloudBackupError())
    void dispatch(restoreCloudBackupThunk())
  }, [dispatch, hasCloudBackup])

  if (import.meta.env.VITE_AUTH_MODE !== 'http') {
    return null
  }

  const status =
    restoreStatus === 'failed' || uploadStatus === 'failed'
      ? 'failed'
      : isBusy
        ? 'loading'
        : fetchStatus

  return (
    <div className={styles.root}>
      <p className={styles.status} aria-live="polite" data-status={status}>
        {message}
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          disabled={isBusy}
          onClick={handleBackup}
        >
          {uploadStatus === 'loading' ? 'Backing up…' : 'Backup to cloud'}
        </button>

        <button
          type="button"
          className={styles.actionButton}
          disabled={isBusy || !hasCloudBackup}
          onClick={handleRestore}
        >
          {restoreStatus === 'loading' ? 'Restoring…' : 'Restore from cloud'}
        </button>
      </div>

      {uploadError ? <p className={styles.actionError}>{uploadError}</p> : null}
      {restoreError ? (
        <p className={styles.actionError}>{restoreError}</p>
      ) : null}
    </div>
  )
}
