import React from 'react'
import clsx from 'clsx'
import styles from './CropOverlay.module.scss'
import type { ImageData, CropArea } from '../domain/types'

interface CropOverlayProps {
  crop: CropArea
  imageData: ImageData
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  crop,
  imageData,
}) => {
  const top = {
    top: imageData.top,
    left: imageData.left,
    width: imageData.width,
    height: crop.y - imageData.top,
  }

  const left = {
    top: imageData.top + crop.y - imageData.top,
    left: imageData.left,
    width: crop.x - imageData.left,
    height: crop.height,
  }

  const right = {
    top: imageData.top + crop.y - imageData.top,
    left: crop.x + crop.width,
    width: imageData.width - crop.width - (crop.x - imageData.left),
    height: crop.height,
  }

  const bottom = {
    top: crop.y + crop.height,
    left: imageData.left,
    width: imageData.width,
    height: imageData.height - (crop.y + crop.height - imageData.top),
  }

  return (
    <>
      <div className={clsx(styles.overlay, styles.overlayTop)} style={top} />
      <div className={clsx(styles.overlay, styles.overlayLeft)} style={left} />
      <div
        className={clsx(styles.overlay, styles.overlayRight)}
        style={right}
      />
      <div
        className={clsx(styles.overlay, styles.overlayBottom)}
        style={bottom}
      />
    </>
  )
}
