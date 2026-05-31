import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  clampAvatarCropPosition,
  cropAvatarToDataUrl,
  getAvatarCropPixels,
  getAvatarImageDisplaySize,
  getInitialAvatarCropState,
  loadImage,
} from '@shared/lib/image/avatarCrop'
import styles from './UserAvatarCropView.module.scss'

const VIEWPORT_SIZE = 192
const MIN_ZOOM = 1
const MAX_ZOOM = 3

type UserAvatarCropViewProps = {
  imageUrl: string
  saving?: boolean
  onConfirm: (dataUrl: string) => void
  onCancel: () => void
}

export const UserAvatarCropView: React.FC<UserAvatarCropViewProps> = ({
  imageUrl,
  saving = false,
  onConfirm,
  onCancel,
}) => {
  const dragStartRef = useRef<{
    pointerX: number
    pointerY: number
    positionX: number
    positionY: number
  } | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void loadImage(imageUrl)
      .then((loadedImage) => {
        if (cancelled) return
        setImage(loadedImage)
        setLoadError(null)
        const initial = getInitialAvatarCropState(
          loadedImage.naturalWidth,
          loadedImage.naturalHeight,
          VIEWPORT_SIZE,
        )
        setZoom(initial.zoom)
        setPosition(initial.position)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError('Could not load image')
      })

    return () => {
      cancelled = true
    }
  }, [imageUrl])

  const updatePosition = useCallback(
    (nextPosition: { x: number; y: number }, nextZoom = zoom) => {
      if (!image) return

      const { width, height } = getAvatarImageDisplaySize(
        image.naturalWidth,
        image.naturalHeight,
        VIEWPORT_SIZE,
        nextZoom,
      )

      setPosition(
        clampAvatarCropPosition(nextPosition, width, height, VIEWPORT_SIZE),
      )
    },
    [image, zoom],
  )

  const handleZoomChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!image) return

      const nextZoom = Number(event.target.value)
      const { width, height } = getAvatarImageDisplaySize(
        image.naturalWidth,
        image.naturalHeight,
        VIEWPORT_SIZE,
        nextZoom,
      )
      const centerX = VIEWPORT_SIZE / 2
      const centerY = VIEWPORT_SIZE / 2
      const imageCenterX = position.x + width / 2
      const imageCenterY = position.y + height / 2
      const ratio = nextZoom / zoom
      const nextPosition = {
        x: centerX - (centerX - imageCenterX) * ratio,
        y: centerY - (centerY - imageCenterY) * ratio,
      }

      setZoom(nextZoom)
      updatePosition(nextPosition, nextZoom)
    },
    [image, position.x, position.y, updatePosition, zoom],
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!image || saving) return

      event.currentTarget.setPointerCapture(event.pointerId)
      dragStartRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        positionX: position.x,
        positionY: position.y,
      }
    },
    [image, position.x, position.y, saving],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragStart = dragStartRef.current
      if (!dragStart) return

      updatePosition({
        x: dragStart.positionX + (event.clientX - dragStart.pointerX),
        y: dragStart.positionY + (event.clientY - dragStart.pointerY),
      })
    },
    [updatePosition],
  )

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      dragStartRef.current = null
    },
    [],
  )

  const handleConfirm = useCallback(async () => {
    if (!image) return

    const crop = getAvatarCropPixels(
      image.naturalWidth,
      image.naturalHeight,
      VIEWPORT_SIZE,
      zoom,
      position,
    )
    const dataUrl = await cropAvatarToDataUrl(image, crop)
    onConfirm(dataUrl)
  }, [image, onConfirm, position, zoom])

  if (loadError) {
    return <p className={styles.zoomLabel}>{loadError}</p>
  }

  if (!image) {
    return null
  }

  const { width, height } = getAvatarImageDisplaySize(
    image.naturalWidth,
    image.naturalHeight,
    VIEWPORT_SIZE,
    zoom,
  )

  return (
    <div className={styles.root}>
      <div
        className={styles.viewport}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={styles.imageLayer}
          style={{
            width,
            height,
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <img
            src={imageUrl}
            alt=""
            className={styles.image}
            draggable={false}
            style={{ width, height }}
          />
        </div>
      </div>

      <div className={styles.zoomRow}>
        <span className={styles.zoomLabel}>Zoom</span>
        <input
          className={styles.zoomSlider}
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          disabled={saving}
          onChange={handleZoomChange}
        />
      </div>

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
    </div>
  )
}
