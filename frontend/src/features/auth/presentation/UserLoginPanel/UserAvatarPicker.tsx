import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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

export type AvatarCropState = {
  active: boolean
}

export type UserAvatarCropToolbarActions = {
  confirmCrop: () => void
  cancelCrop: () => void
  openFilePicker: () => void
  saving: boolean
}

export const UserAvatarPicker: React.FC<{
  onAvatarCropStateChange?: (state: AvatarCropState) => void
  onCropToolbarActions?: (actions: UserAvatarCropToolbarActions | null) => void
}> = ({ onAvatarCropStateChange, onCropToolbarActions }) => {
  const dispatch = useAppDispatch()
  const avatarUrl = useAppSelector(selectAuthUserAvatarUrl)
  const authError = useAppSelector(selectAuthError)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const cropObjectUrlRef = useRef<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [avatarSessionActive, setAvatarSessionActive] = useState(false)
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null)
  const [cropMode, setCropMode] = useState<'preview' | 'crop'>('crop')
  const confirmCropRef = useRef<(() => Promise<void>) | null>(null)

  const notifyCropState = useCallback(
    (active: boolean) => {
      onAvatarCropStateChange?.({ active })
    },
    [onAvatarCropStateChange],
  )

  const revokeCropObjectUrl = useCallback(() => {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current)
      cropObjectUrlRef.current = null
    }
  }, [])

  const clearCropImageOnly = useCallback(() => {
    revokeCropObjectUrl()
    setCropImageUrl(null)
    setCropMode('crop')
  }, [revokeCropObjectUrl])

  const endAvatarSession = useCallback(() => {
    clearCropImageOnly()
    setAvatarSessionActive(false)
    notifyCropState(false)
  }, [clearCropImageOnly, notifyCropState])

  const handleCropCancel = useCallback(() => {
    endAvatarSession()
  }, [endAvatarSession])

  const handleOpenExistingAvatar = useCallback(() => {
    if (!avatarUrl || saving) return

    setLocalError(null)
    dispatch(clearAuthError())
    revokeCropObjectUrl()

    setCropImageUrl(avatarUrl)
    setCropMode('preview')
    setAvatarSessionActive(true)
    notifyCropState(true)
  }, [avatarUrl, dispatch, notifyCropState, revokeCropObjectUrl, saving])

  useEffect(() => () => endAvatarSession(), [endAvatarSession])

  useLayoutEffect(() => {
    if (!avatarSessionActive) {
      onCropToolbarActions?.(null)
      return
    }

    onCropToolbarActions?.({
      confirmCrop: () => {
        if (cropMode === 'preview' || !cropImageUrl) {
          return
        }
        void confirmCropRef.current?.()
      },
      cancelCrop: handleCropCancel,
      openFilePicker: () => inputRef.current?.click(),
      saving,
    })
  }, [
    avatarSessionActive,
    cropImageUrl,
    cropMode,
    endAvatarSession,
    handleCropCancel,
    onCropToolbarActions,
    saving,
  ])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      setLocalError(null)
      dispatch(clearAuthError())
      revokeCropObjectUrl()

      try {
        const objectUrl = readImageFileAsObjectUrl(file)
        cropObjectUrlRef.current = objectUrl
        setCropImageUrl(objectUrl)
        setCropMode('crop')
        setAvatarSessionActive(true)
        notifyCropState(true)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to open image'
        setLocalError(message)
      }
    },
    [dispatch, notifyCropState, revokeCropObjectUrl],
  )

  const handleCropConfirm = useCallback(
    async (dataUrl: string) => {
      setLocalError(null)
      dispatch(clearAuthError())

      try {
        setSaving(true)
        const savedUrl = await dispatch(updateAvatarThunk(dataUrl)).unwrap()
        revokeCropObjectUrl()
        if (savedUrl) {
          setCropImageUrl(savedUrl)
          setCropMode('preview')
        } else {
          clearCropImageOnly()
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update avatar'
        setLocalError(message)
      } finally {
        setSaving(false)
      }
    },
    [clearCropImageOnly, dispatch, revokeCropObjectUrl],
  )

  const handleDeleteAvatar = useCallback(async () => {
    if (saving) return

    setLocalError(null)
    dispatch(clearAuthError())

    try {
      setSaving(true)
      await dispatch(updateAvatarThunk(null)).unwrap()
      clearCropImageOnly()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete avatar'
      setLocalError(message)
    } finally {
      setSaving(false)
    }
  }, [clearCropImageOnly, dispatch, saving])

  const handleCropDelete = useCallback(() => {
    if (cropObjectUrlRef.current) {
      clearCropImageOnly()
      return
    }
    if (avatarUrl) {
      void handleDeleteAvatar()
      return
    }
    handleCropCancel()
  }, [avatarUrl, clearCropImageOnly, handleCropCancel, handleDeleteAvatar])

  const errorMessage = localError ?? authError
  const chooseControlClassName = clsx(
    styles.chooseControl,
    saving && styles.chooseControlDisabled,
  )

  if (avatarSessionActive) {
    return (
      <div className={clsx(styles.root, styles.rootCropActive)}>
        {cropImageUrl ? (
          <UserAvatarCropView
            imageUrl={cropImageUrl}
            mode={cropMode}
            saving={saving}
            showActions={false}
            onDelete={handleCropDelete}
            onRegisterConfirm={(confirm) => {
              confirmCropRef.current = confirm
            }}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
          />
        ) : (
          <UserAvatarCropView mode="empty" saving={saving} onConfirm={() => {}} onCancel={handleCropCancel} />
        )}
        {errorMessage ? (
          <p className={clsx(styles.error, styles.errorVisible)} role="alert">
            {errorMessage}
          </p>
        ) : null}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          className={styles.fileInput}
          disabled={saving}
          onChange={handleFileChange}
        />
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {avatarUrl ? (
        <button
          type="button"
          className={chooseControlClassName}
          disabled={saving}
          onClick={handleOpenExistingAvatar}
        >
          <span className={styles.previewSlot} aria-hidden>
            <span className={styles.previewFallback}>
              {getToolbarIcon({ key: 'userLoginAdd' })}
            </span>
          </span>
          <span className={styles.chooseLabel}>Change photo</span>
        </button>
      ) : (
        <label htmlFor={inputId} className={chooseControlClassName}>
          <span className={styles.previewSlot} aria-hidden>
            <span className={styles.previewFallback}>
              {getToolbarIcon({ key: 'userLoginAdd' })}
            </span>
          </span>
          <span className={styles.chooseLabel}>Choose photo</span>
        </label>
      )}
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
