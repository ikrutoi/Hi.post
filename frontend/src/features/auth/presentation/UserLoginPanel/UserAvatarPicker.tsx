import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { getToolbarIcon } from '@shared/utils/icons'
import {
  selectAuthError,
  selectAuthUserAvatarUrl,
} from '@features/auth/infrastructure/selectors/authSelectors'
import { clearAuthError } from '@features/auth/infrastructure/state/auth.slice'
import { updateAvatarThunk } from '@features/auth/store/auth.thunks'
import { UserAvatarCropView } from './UserAvatarCropView'
import styles from './UserAvatarPicker.module.scss'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

function readImageFileAsObjectUrl(file: File): string {
  if (
    !ACCEPTED_IMAGE_TYPES.includes(
      file.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
    )
  ) {
    throw new Error('Choose a JPEG, PNG, WebP, or GIF image')
  }

  return URL.createObjectURL(file)
}

export const UserAvatarPicker: React.FC = () => {
  const dispatch = useAppDispatch()
  const avatarUrl = useAppSelector(selectAuthUserAvatarUrl)
  const authError = useAppSelector(selectAuthError)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const cropObjectUrlRef = useRef<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null)

  const clearCropImage = useCallback(() => {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current)
      cropObjectUrlRef.current = null
    }
    setCropImageUrl(null)
  }, [])

  useEffect(() => () => clearCropImage(), [clearCropImage])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      setLocalError(null)
      dispatch(clearAuthError())
      clearCropImage()

      try {
        const objectUrl = readImageFileAsObjectUrl(file)
        cropObjectUrlRef.current = objectUrl
        setCropImageUrl(objectUrl)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to open image'
        setLocalError(message)
      }
    },
    [clearCropImage, dispatch],
  )

  const handleCropCancel = useCallback(() => {
    clearCropImage()
  }, [clearCropImage])

  const handleCropConfirm = useCallback(
    async (dataUrl: string) => {
      setLocalError(null)
      dispatch(clearAuthError())

      try {
        setSaving(true)
        await dispatch(updateAvatarThunk(dataUrl)).unwrap()
        clearCropImage()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update avatar'
        setLocalError(message)
      } finally {
        setSaving(false)
      }
    },
    [clearCropImage, dispatch],
  )

  const handleRemove = useCallback(async () => {
    setLocalError(null)
    dispatch(clearAuthError())
    setPreviewFailed(false)
    clearCropImage()

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
  }, [clearCropImage, dispatch])

  const errorMessage = localError ?? authError

  if (cropImageUrl) {
    return (
      <div className={styles.root}>
        <UserAvatarCropView
          imageUrl={cropImageUrl}
          saving={saving}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
        {errorMessage ? (
          <p className={clsx(styles.error, styles.errorVisible)} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.previewRow}>
        <label
          htmlFor={inputId}
          className={clsx(
            styles.chooseControl,
            saving && styles.chooseControlDisabled,
          )}
        >
          <span className={styles.previewSlot} aria-hidden>
            <span className={styles.previewFallback}>
              {getToolbarIcon({ key: 'userLoginAdd' })}
            </span>
          </span>
          <span className={styles.chooseLabel}>
            {avatarUrl ? 'Change photo' : 'Choose photo'}
          </span>
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
