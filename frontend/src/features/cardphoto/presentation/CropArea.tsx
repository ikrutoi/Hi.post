import React from 'react'
import clsx from 'clsx'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { clampCropToImage, enforceAspectRatio } from '../application/helpers'
import styles from './CropArea.module.scss'
import type { ImageLayer, CropLayer } from '../domain/types'

interface CropAreaProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
  onChange: (newCrop: CropLayer) => void
}

export const CropArea: React.FC<CropAreaProps> = ({
  cropLayer,
  imageLayer,
  onChange,
}) => {
  const minWidth = 20
  const minHeight = 20

  const round2 = (value: number) => Number(value.toFixed(0))

  const handleMouseDown = (corner: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startCrop = { ...cropLayer }
    const aspectRatio = cropLayer.meta.aspectRatio

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newCrop = { ...startCrop }

      switch (corner) {
        case 'BR': {
          let newWidth = startCrop.meta.width + dx
          let newHeight = round2(newWidth / CARD_SCALE_CONFIG.aspectRatio)
          newCrop.meta.width = Math.max(newWidth, minWidth)
          newCrop.meta.height = Math.max(newHeight, minHeight)
          break
        }
        case 'TR': {
          let newWidth = startCrop.meta.width + dx
          let newHeight = round2(newWidth / CARD_SCALE_CONFIG.aspectRatio)
          newCrop.meta.width = Math.max(newWidth, minWidth)
          newCrop.meta.height = Math.max(newHeight, minHeight)
          newCrop.y = startCrop.y + dy
          break
        }
        case 'BL': {
          let newWidth = startCrop.meta.width - dx
          let newHeight = round2(newWidth / CARD_SCALE_CONFIG.aspectRatio)
          newCrop.meta.width = Math.max(newWidth, minWidth)
          newCrop.meta.height = Math.max(newHeight, minHeight)
          newCrop.x = startCrop.x + dx
          break
        }
        case 'TL': {
          let newWidth = startCrop.meta.width - dx
          let newHeight = round2(newWidth / CARD_SCALE_CONFIG.aspectRatio)
          newCrop.meta.width = Math.max(newWidth, minWidth)
          newCrop.meta.height = Math.max(newHeight, minHeight)
          newCrop.x = startCrop.x + dx
          newCrop.y = startCrop.y + dy
          break
        }
      }

      if (imageLayer) {
        newCrop = clampCropToImage(newCrop, imageLayer)
        newCrop = enforceAspectRatio(newCrop, imageLayer)
      }

      onChange({
        ...newCrop,
        meta: {
          ...newCrop.meta,
          aspectRatio,
        },
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
    const startCrop = { ...cropLayer }

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY

      let newX = startCrop.x + dx
      let newY = startCrop.y + dy

      if (!imageLayer) return

      newX = Math.max(
        imageLayer.left,
        Math.min(
          newX,
          imageLayer.left + imageLayer.meta.width - startCrop.meta.width
        )
      )
      newY = Math.max(
        imageLayer.top,
        Math.min(
          newY,
          imageLayer.top + imageLayer.meta.height - startCrop.meta.height
        )
      )

      onChange({
        ...startCrop,
        x: round2(newX),
        y: round2(newY),
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
        top: `${cropLayer.y}px`,
        left: `${cropLayer.x}px`,
        width: `${cropLayer.meta.width}px`,
        height: `${cropLayer.meta.height}px`,
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
