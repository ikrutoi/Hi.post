import React, { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { getToolbarIcon } from '@shared/utils/icons'
import { IconEditLight, IconUserLogin } from '@shared/ui/icons'
import {
  AVATAR_CORNER_RADIUS_RATIO,
  AVATAR_CROP_CORNER_RADIUS_RATIO,
  clampAvatarCropPosition,
  cropAvatarToDataUrl,
  getAvatarCropPixels,
  getAvatarPreviewDisplayLayout,
  getInitialAvatarCropState,
  loadImage,
  type AvatarStageLayout,
} from '@shared/lib/image/avatarCrop'
import styles from './UserAvatarCropView.module.scss'

type UserAvatarCropViewProps = {
  imageUrl?: string
  mode?: 'preview' | 'crop' | 'empty'
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
  mode = 'crop',
  saving = false,
  showEditBadge = false,
  showActions = true,
  onRegisterConfirm,
  onConfirm,
  onCancel,
  onDelete,
}) => {
  const stageFrameRef = useRef<HTMLDivElement>(null)
  const cropDragStartRef = useRef<{
    pointerX: number
    pointerY: number
    cropX: number
    cropY: number
  } | null>(null)
  const [stageSide, setStageSide] = useState(0)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [layout, setLayout] = useState<AvatarStageLayout | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
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
    if (mode === 'empty' || !imageUrl || stageSide <= 0) return

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
        if (mode === 'crop') {
          setPosition(initial.position)
          setCropPosition(initial.cropPosition)
        }
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
  }, [imageUrl, mode, stageSide])

  const updateCropPosition = useCallback(
    (nextCropPosition: { x: number; y: number }) => {
      if (!layout) return
      setCropPosition(
        clampAvatarCropPosition(nextCropPosition, layout, position),
      )
    },
    [layout, position],
  )

  const handleCropPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!layout || saving) return

      event.currentTarget.setPointerCapture(event.pointerId)
      cropDragStartRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        cropX: cropPosition.x,
        cropY: cropPosition.y,
      }
    },
    [cropPosition.x, cropPosition.y, layout, saving],
  )

  const handleCropPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragStart = cropDragStartRef.current
      if (!dragStart) return

      updateCropPosition({
        x: dragStart.cropX + (event.clientX - dragStart.pointerX),
        y: dragStart.cropY + (event.clientY - dragStart.pointerY),
      })
    },
    [updateCropPosition],
  )

  const handleCropPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      cropDragStartRef.current = null
    },
    [],
  )

  const handleConfirm = useCallback(async () => {
    if (!image || !layout) return

    const layoutWithCrop: AvatarStageLayout = {
      ...layout,
      cropX: cropPosition.x,
      cropY: cropPosition.y,
    }
    const crop = getAvatarCropPixels(
      image.naturalWidth,
      image.naturalHeight,
      layoutWithCrop,
      position,
    )
    const dataUrl = await cropAvatarToDataUrl(image, crop)
    onConfirm(dataUrl)
  }, [cropPosition.x, cropPosition.y, image, layout, onConfirm, position])

  useEffect(() => {
    if (mode === 'preview') {
      onRegisterConfirm?.(null)
      return
    }
    onRegisterConfirm?.(handleConfirm)
    return () => onRegisterConfirm?.(null)
  }, [handleConfirm, mode, onRegisterConfirm])

  if (loadError) {
    return <p className={styles.errorText}>{loadError}</p>
  }

  if (mode === 'empty') {
    const stageSize = stageSide > 0 ? stageSide : undefined

    return (
      <div className={styles.root}>
        <div ref={stageFrameRef} className={styles.previewFrame}>
          <div
            className={styles.stage}
            style={
              stageSize
                ? { width: stageSize, height: stageSize }
                : undefined
            }
          >
            <div className={styles.stageEmptyPlaceholder} aria-hidden>
              <IconUserLogin className={styles.stageEmptyIcon} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!layout || stageSide <= 0) {
    return (
      <div className={styles.root}>
        <div
          ref={stageFrameRef}
          className={
            mode === 'preview' ? styles.previewFrame : styles.stageFrame
          }
          aria-hidden
        />
      </div>
    )
  }

  if (mode === 'crop' && !image) {
    return (
      <div className={styles.root}>
        <div ref={stageFrameRef} className={styles.stageFrame} aria-hidden />
      </div>
    )
  }

  const cropRadius = layout.cropSize * AVATAR_CROP_CORNER_RADIUS_RATIO
  const previewDisplay = getAvatarPreviewDisplayLayout(layout)
  const previewRadius = previewDisplay.size * AVATAR_CORNER_RADIUS_RATIO

  if (mode === 'preview') {
    return (
      <div className={styles.root}>
        <div ref={stageFrameRef} className={styles.previewFrame}>
          <div
            className={clsx(styles.stage, styles.stagePreview)}
            style={{
              width: layout.stageSide,
              height: layout.stageSide,
            }}
          >
            <div
              className={styles.previewAvatarWrap}
              style={{
                left: previewDisplay.x,
                top: previewDisplay.y,
                width: previewDisplay.size,
                height: previewDisplay.size,
              }}
            >
            <img
              src={imageUrl}
              alt=""
              className={styles.previewImage}
              draggable={false}
              style={{ borderRadius: `${previewRadius}px` }}
            />
            {onDelete ? (
              <button
                type="button"
                className={styles.previewDeleteBtn}
                disabled={saving}
                onClick={() => onDelete()}
                aria-label="Delete photo"
                title="Delete photo"
              >
                {getToolbarIcon({ key: 'delete' })}
              </button>
            ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              transform: `translate(${position.x}px, ${position.y}px)`,
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

          <div
            className={styles.cropMask}
            style={{
              left: cropPosition.x,
              top: cropPosition.y,
              width: layout.cropSize,
              height: layout.cropSize,
              borderRadius: `${cropRadius}px`,
            }}
            aria-hidden
          />

          <div
            className={styles.cropDragLayer}
            style={{
              left: cropPosition.x,
              top: cropPosition.y,
              width: layout.cropSize,
              height: layout.cropSize,
              borderRadius: `${cropRadius}px`,
            }}
            onPointerDown={handleCropPointerDown}
            onPointerMove={handleCropPointerMove}
            onPointerUp={handleCropPointerUp}
            onPointerCancel={handleCropPointerUp}
            aria-hidden
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
