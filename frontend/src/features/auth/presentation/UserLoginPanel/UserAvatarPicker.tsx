import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
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

/** `image/*` — системный выбор из галереи; MIME проверяем при загрузке. */
const FILE_INPUT_ACCEPT = 'image/*'

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
  canApply: boolean
}

export type UserAvatarPickerHandle = {
  openFilePicker: () => void
}

type UserAvatarPickerProps = {
  userEmail?: string | null
  onAvatarCropStateChange?: (state: AvatarCropState) => void
  onCropToolbarActions?: (actions: UserAvatarCropToolbarActions | null) => void
}

export const UserAvatarPicker = forwardRef<
  UserAvatarPickerHandle,
  UserAvatarPickerProps
>(function UserAvatarPicker(
  { userEmail, onAvatarCropStateChange, onCropToolbarActions },
  ref,
) {
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

  const handleOpenAvatarSession = useCallback(() => {
    if (saving) return

    setLocalError(null)
    dispatch(clearAuthError())
    revokeCropObjectUrl()
    setCropImageUrl(null)
    setCropMode('crop')
    setAvatarSessionActive(true)
    notifyCropState(true)
  }, [dispatch, notifyCropState, revokeCropObjectUrl, saving])

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

  const processSelectedFile = useCallback(
    (file: File) => {
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

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      processSelectedFile(file)
    },
    [processSelectedFile],
  )

  const openFilePicker = useCallback(() => {
    if (saving) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = FILE_INPUT_ACCEPT
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      processSelectedFile(file)
    }
    input.click()
  }, [processSelectedFile, saving])

  useImperativeHandle(ref, () => ({ openFilePicker }), [openFilePicker])

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
      openFilePicker,
      saving,
      canApply: Boolean(cropImageUrl) && cropMode === 'crop',
    })
  }, [
    avatarSessionActive,
    cropImageUrl,
    cropMode,
    handleCropCancel,
    onCropToolbarActions,
    openFilePicker,
    saving,
  ])

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

  const fileInput = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={FILE_INPUT_ACCEPT}
      className={styles.fileInput}
      disabled={saving}
      onChange={handleFileChange}
    />
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
        {fileInput}
      </div>
    )
  }

  const handleProfileAvatarClick = () => {
    if (avatarUrl) {
      handleOpenExistingAvatar()
      return
    }
    handleOpenAvatarSession()
  }

  return (
    <div className={styles.root}>
      <div className={styles.profileRow}>
        <div className={styles.profileAvatarWrap}>
          <button
            type="button"
            className={clsx(
              styles.profileAvatar,
              saving && styles.profileAvatarDisabled,
            )}
            disabled={saving}
            onClick={handleProfileAvatarClick}
            aria-label={avatarUrl ? 'Change photo' : 'Choose photo'}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className={styles.profileAvatarImage}
                draggable={false}
              />
            ) : (
              <span className={styles.profileAvatarPlaceholder} aria-hidden>
                {getToolbarIcon({ key: 'userLogin' })}
              </span>
            )}
          </button>
          <button
            type="button"
            className={styles.profileAvatarEditBtn}
            disabled={saving}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleProfileAvatarClick}
            aria-label={avatarUrl ? 'Change photo' : 'Choose photo'}
            title={avatarUrl ? 'Change photo' : 'Choose photo'}
          >
            {getToolbarIcon({ key: 'editLight' })}
          </button>
        </div>
        {userEmail ? (
          <p className={styles.profileEmail}>{userEmail}</p>
        ) : null}
      </div>
      {errorMessage ? (
        <p className={clsx(styles.error, styles.errorVisible)} role="alert">
          {errorMessage}
        </p>
      ) : null}
      {fileInput}
    </div>
  )
})
