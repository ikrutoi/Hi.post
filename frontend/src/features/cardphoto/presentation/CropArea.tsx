import React from 'react'
import clsx from 'clsx'
import styles from './CropArea.module.scss'
import type { ImageData } from '../domain/types'

interface CropAreaProps {
  crop: ImageData
  imageData: ImageData | null
  onChange: (newCrop: ImageData) => void
}

export const CropArea: React.FC<CropAreaProps> = ({
  crop,
  imageData,
  onChange,
}) => {
  const minWidth = 20
  const minHeight = 20

  const handleMouseDown = (corner: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startCrop = { ...crop }
    const aspectRatio = crop.aspectRatio

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newCrop = { ...startCrop }

      switch (corner) {
        case 'BR': {
          let newWidth = startCrop.width + dx
          let newHeight = aspectRatio
            ? newWidth / aspectRatio
            : startCrop.height + dy
          newCrop.width = Math.max(newWidth, minWidth)
          newCrop.height = Math.max(newHeight, minHeight)
          break
        }
        case 'TR': {
          let newWidth = startCrop.width + dx
          let newHeight = aspectRatio
            ? newWidth / aspectRatio
            : startCrop.height - dy
          newCrop.width = Math.max(newWidth, minWidth)
          newCrop.height = Math.max(newHeight, minHeight)
          newCrop.top = startCrop.top + dy
          break
        }
        case 'BL': {
          let newWidth = startCrop.width - dx
          let newHeight = aspectRatio
            ? newWidth / aspectRatio
            : startCrop.height + dy
          newCrop.width = Math.max(newWidth, minWidth)
          newCrop.height = Math.max(newHeight, minHeight)
          newCrop.left = startCrop.left + dx
          break
        }
        case 'TL': {
          let newWidth = startCrop.width - dx
          let newHeight = aspectRatio
            ? newWidth / aspectRatio
            : startCrop.height - dy
          newCrop.width = Math.max(newWidth, minWidth)
          newCrop.height = Math.max(newHeight, minHeight)
          newCrop.left = startCrop.left + dx
          newCrop.top = startCrop.top + dy
          break
        }
      }

      onChange({
        ...newCrop,
        aspectRatio,
      })
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startCrop = { ...crop }

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newLeft = startCrop.left + dx
      let newTop = startCrop.top + dy

      if (!imageData) return

      newLeft = Math.max(
        imageData.left,
        Math.min(newLeft, imageData.left + imageData.width - startCrop.width)
      )
      newTop = Math.max(
        imageData.top,
        Math.min(newTop, imageData.top + imageData.height - startCrop.height)
      )

      onChange({
        ...startCrop,
        left: newLeft,
        top: newTop,
        aspectRatio: crop.aspectRatio,
      })
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      className={styles.cropArea}
      style={{
        top: `${crop.top}px`,
        left: `${crop.left}px`,
        width: `${crop.width}px`,
        height: `${crop.height}px`,
      }}
      onMouseDown={handleDrag}
    >
      <div
        className={clsx(styles.handle, styles.handleTL)}
        style={{ left: 0, top: 0 }}
        onMouseDown={(e) => handleMouseDown('TL', e)}
      />
      <div
        className={clsx(styles.handle, styles.handleTR)}
        style={{ right: 0, top: 0 }}
        onMouseDown={(e) => handleMouseDown('TR', e)}
      />
      <div
        className={clsx(styles.handle, styles.handleBL)}
        style={{ left: 0, bottom: 0 }}
        onMouseDown={(e) => handleMouseDown('BL', e)}
      />
      <div
        className={clsx(styles.handle, styles.handleBR)}
        style={{ right: 0, bottom: 0 }}
        onMouseDown={(e) => handleMouseDown('BR', e)}
      />
    </div>
  )
}
