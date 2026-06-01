import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getToolbarIcon } from '@shared/utils/icons'
import { IconEditLight } from '@shared/ui/icons'
import {
  cropAvatarToDataUrl,
  getAvatarCropPixels,
  getCenteredAvatarImagePosition,
  getInitialAvatarCropState,
  loadImage,
  type AvatarStageLayout,
} from '@shared/lib/image/avatarCrop'
import styles from './UserAvatarCropView.module.scss'

type UserAvatarCropViewProps = {
  imageUrl: string
  saving?: boolean
  showEditBadge?: boolean
  showActions?: boolean
  onRegisterConfirm?: (confirm: (() => Promise<void>) | null) => void
  onConfirm: (dataUrl: string) => void
  onCancel: () => void
  onDelete?: () => void
}

export const UserAvatarCropView: React.FC<UserAvatarCropViewProps> = ({
  imageUrl,
  saving = false,
  showEditBadge = false,
  showActions = true,
  onRegisterConfirm,
  onConfirm,
  onCancel,
  onDelete,
}) => {
  const stageFrameRef = useRef<HTMLDivElement>(null)
  const [stageSide, setStageSide] = useState(0)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [layout, setLayout] = useState<AvatarStageLayout | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const element = stageFrameRef.current
    if (!element) return

    const updateStageSide = () => {
      const width = Math.floor(element.getBoundingClientRect().width)
      if (width > 0) {
        setStageSide(width)
      }
    }

    updateStageSide()
    const observer = new ResizeObserver(updateStageSide)
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (stageSide <= 0) return

    let cancelled = false

    void loadImage(imageUrl)
      .then((loadedImage) => {
        if (cancelled) return
        setImage(loadedImage)
        setLoadError(null)
        const initial = getInitialAvatarCropState(
          loadedImage.naturalWidth,
          loadedImage.naturalHeight,
          stageSide,
        )
        setLayout(initial.layout)
      })
      .catch(() => {
        if (cancelled) return
        setImage(null)
        setLayout(null)
        setLoadError('Could not load image')
      })

    return () => {
      cancelled = true
    }
  }, [imageUrl, stageSide])

  const handleConfirm = useCallback(async () => {
    if (!image || !layout) return

    const position = getCenteredAvatarImagePosition(layout)
    const crop = getAvatarCropPixels(
      image.naturalWidth,
      image.naturalHeight,
      layout,
      position,
    )
    const dataUrl = await cropAvatarToDataUrl(image, crop)
    onConfirm(dataUrl)
  }, [image, layout, onConfirm])

  useEffect(() => {
    onRegisterConfirm?.(handleConfirm)
    return () => onRegisterConfirm?.(null)
  }, [handleConfirm, onRegisterConfirm])

  if (loadError) {
    return <p className={styles.errorText}>{loadError}</p>
  }

  if (!image || !layout || stageSide <= 0) {
    return (
      <div className={styles.root}>
        <div ref={stageFrameRef} className={styles.stageFrame} aria-hidden />
      </div>
    )
  }

  const imagePosition = getCenteredAvatarImagePosition(layout)

  return (
    <div className={styles.root}>
      <div ref={stageFrameRef} className={styles.stageFrame}>
        <div
          className={styles.stage}
          style={{
            width: layout.stageSide,
            height: layout.stageSide,
          }}
        >
          <div
            className={styles.imageLayer}
            style={{
              width: layout.displayWidth,
              height: layout.displayHeight,
              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
            }}
          >
            <img
              src={imageUrl}
              alt=""
              className={styles.image}
              draggable={false}
              style={{
                width: layout.displayWidth,
                height: layout.displayHeight,
              }}
            />
          </div>

          {onDelete ? (
            <button
              type="button"
              className={styles.deleteBtn}
              disabled={saving}
              onClick={() => onDelete()}
              aria-label="Delete photo"
              title="Delete photo"
            >
              {getToolbarIcon({ key: 'delete' })}
            </button>
          ) : null}
        </div>

        {showEditBadge ? (
          <span className={styles.editBadge} aria-hidden>
            <IconEditLight />
          </span>
        ) : null}
      </div>

      {showActions ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={saving}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={saving}
            onClick={() => {
              void handleConfirm()
            }}
          >
            {saving ? 'Saving…' : 'Apply'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
