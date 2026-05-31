import React, { useCallback, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { getToolbarIcon } from '@shared/utils/icons'
import {
  selectAuthError,
  selectAuthUserAvatarUrl,
} from '@features/auth/infrastructure/selectors/authSelectors'
import { clearAuthError } from '@features/auth/infrastructure/state/auth.slice'
import { updateAvatarThunk } from '@features/auth/store/auth.thunks'
import styles from './UserAvatarPicker.module.scss'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

const MAX_AVATAR_BYTES = 512 * 1024

async function readImageFileAsDataUrl(file: File): Promise<string> {
  if (
    !ACCEPTED_IMAGE_TYPES.includes(
      file.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
    )
  ) {
    throw new Error('Choose a JPEG, PNG, WebP, or GIF image')
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Image must be smaller than 512 KB')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Could not read image'))
    }
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.readAsDataURL(file)
  })
}

export const UserAvatarPicker: React.FC = () => {
  const dispatch = useAppDispatch()
  const avatarUrl = useAppSelector(selectAuthUserAvatarUrl)
  const authError = useAppSelector(selectAuthError)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleChooseClick = useCallback(() => {
    setLocalError(null)
    dispatch(clearAuthError())
    inputRef.current?.click()
  }, [dispatch])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      setLocalError(null)
      dispatch(clearAuthError())
      setPreviewFailed(false)

      try {
        const dataUrl = await readImageFileAsDataUrl(file)
        setSaving(true)
        await dispatch(updateAvatarThunk(dataUrl)).unwrap()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update avatar'
        setLocalError(message)
      } finally {
        setSaving(false)
      }
    },
    [dispatch],
  )

  const handleRemove = useCallback(async () => {
    setLocalError(null)
    dispatch(clearAuthError())
    setPreviewFailed(false)

    try {
      setSaving(true)
      await dispatch(updateAvatarThunk(null)).unwrap()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to remove avatar'
      setLocalError(message)
    } finally {
      setSaving(false)
    }
  }, [dispatch])

  const errorMessage = localError ?? authError
  const showPreview = Boolean(avatarUrl) && !previewFailed

  return (
    <div className={styles.root}>
      <div className={styles.previewRow}>
        <div className={styles.previewSlot} aria-hidden>
          {showPreview ? (
            <img
              src={avatarUrl ?? undefined}
              alt=""
              className={styles.previewImage}
              onError={() => setPreviewFailed(true)}
            />
          ) : (
            <span className={styles.previewFallback}>
              {getToolbarIcon({ key: 'userLogin' })}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <label htmlFor={inputId} className={styles.chooseButton}>
            {avatarUrl ? 'Change photo' : 'Choose photo'}
          </label>
          {avatarUrl ? (
            <button
              type="button"
              className={styles.removeButton}
              disabled={saving}
              onClick={handleRemove}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className={styles.fileInput}
        disabled={saving}
        onChange={handleFileChange}
      />
      {errorMessage ? (
        <p className={clsx(styles.error, styles.errorVisible)} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
