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

export type UserAvatarChangePhotoToolbarActions = {
  confirmCrop: () => void
  openFilePicker: () => void
  saving: boolean
}

export const UserAvatarPicker: React.FC<{
  onCropModeChange?: (active: boolean) => void
  onChangePhotoCropActive?: (active: boolean) => void
  onChangePhotoCropToolbarActions?: (
    actions: UserAvatarChangePhotoToolbarActions | null,
  ) => void
}> = ({
  onCropModeChange,
  onChangePhotoCropActive,
  onChangePhotoCropToolbarActions,
}) => {
  const dispatch = useAppDispatch()
  const avatarUrl = useAppSelector(selectAuthUserAvatarUrl)
  const authError = useAppSelector(selectAuthError)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const cropObjectUrlRef = useRef<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null)
  const confirmCropRef = useRef<(() => Promise<void>) | null>(null)
  const isChangePhotoCrop =
    cropImageUrl != null && avatarUrl != null && cropImageUrl === avatarUrl

  const clearCropImage = useCallback(() => {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current)
      cropObjectUrlRef.current = null
    }
    setCropImageUrl(null)
  }, [])

  useEffect(() => () => clearCropImage(), [clearCropImage])

  useLayoutEffect(() => {
    onCropModeChange?.(cropImageUrl != null)
    onChangePhotoCropActive?.(isChangePhotoCrop)
  }, [cropImageUrl, isChangePhotoCrop, onChangePhotoCropActive, onCropModeChange])

  useLayoutEffect(() => {
    if (!isChangePhotoCrop) {
      onChangePhotoCropToolbarActions?.(null)
      return
    }

    onChangePhotoCropToolbarActions?.({
      confirmCrop: () => {
        void confirmCropRef.current?.()
      },
      openFilePicker: () => inputRef.current?.click(),
      saving,
    })
  }, [isChangePhotoCrop, onChangePhotoCropToolbarActions, saving])

  const handleOpenExistingAvatar = useCallback(() => {
    if (!avatarUrl || saving) return

    setLocalError(null)
    dispatch(clearAuthError())
    clearCropImage()
    setCropImageUrl(avatarUrl)
  }, [avatarUrl, clearCropImage, dispatch, saving])

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

  const errorMessage = localError ?? authError
  const chooseControlClassName = clsx(
    styles.chooseControl,
    saving && styles.chooseControlDisabled,
  )

  if (cropImageUrl) {
    return (
      <div className={clsx(styles.root, styles.rootCropActive)}>
        <UserAvatarCropView
          imageUrl={cropImageUrl}
          saving={saving}
          showActions={!isChangePhotoCrop}
          onRegisterConfirm={(confirm) => {
            confirmCropRef.current = confirm
          }}
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
