import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCloudBackup,
  selectCloudBackupError,
  selectCloudBackupFetchStatus,
  selectCloudBackupPostcardCount,
  selectCloudBackupUploadError,
  selectCloudBackupUploadStatus,
} from '../infrastructure/selectors/postcardSyncSelectors'
import { clearCloudBackupError, uploadCloudBackupThunk } from '../store'
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
  const cloudBackup = useAppSelector(selectCloudBackup)
  const postcardCount = useAppSelector(selectCloudBackupPostcardCount)
  const fetchError = useAppSelector(selectCloudBackupError)
  const uploadError = useAppSelector(selectCloudBackupUploadError)

  const isBusy = fetchStatus === 'loading' || uploadStatus === 'loading'

  const message = useMemo(() => {
    if (uploadStatus === 'loading') {
      return 'Saving cloud backup…'
    }

    if (fetchStatus === 'loading' || fetchStatus === 'idle') {
      return 'Checking cloud backup…'
    }

    if (fetchStatus === 'failed') {
      return fetchError ?? 'Could not check cloud backup.'
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
  }, [cloudBackup, fetchError, fetchStatus, postcardCount, uploadStatus])

  const handleBackup = useCallback(() => {
    dispatch(clearCloudBackupError())
    void dispatch(uploadCloudBackupThunk())
  }, [dispatch])

  if (import.meta.env.VITE_AUTH_MODE !== 'http') {
    return null
  }

  const status =
    uploadStatus === 'failed'
      ? 'failed'
      : uploadStatus === 'loading'
        ? 'loading'
        : fetchStatus

  return (
    <div className={styles.root}>
      <p className={styles.status} aria-live="polite" data-status={status}>
        {message}
      </p>

      <button
        type="button"
        className={styles.backupButton}
        disabled={isBusy}
        onClick={handleBackup}
      >
        {uploadStatus === 'loading' ? 'Backing up…' : 'Backup to cloud'}
      </button>

      {uploadError ? <p className={styles.uploadError}>{uploadError}</p> : null}
    </div>
  )
}
