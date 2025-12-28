import React from 'react'
import clsx from 'clsx'
import styles from './CropOverlay.module.scss'
import type { ImageData } from '../domain/types'

interface CropOverlayProps {
  crop: { top: number; left: number; width: number; height: number }
  imageData: ImageData
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  crop,
  imageData,
}) => {
  let top = { width: 0, height: 0, left: 0, top: 0 }
  let left = { width: 0, height: 0, left: 0, top: 0 }
  let right = { width: 0, height: 0, left: 0, top: 0 }
  let bottom = { width: 0, height: 0, left: 0, top: 0 }

  top = {
    top: imageData.top,
    left: imageData.left,
    width: imageData.width,
    height: crop.top - imageData.top,
  }
  left = {
    top: imageData.top + crop.top - imageData.top,
    left: imageData.left,
    width: crop.left - imageData.left,
    height: crop.height,
  }
  right = {
    top: imageData.top + crop.top - imageData.top,
    left: crop.left + crop.width,
    width: imageData.width - crop.width - (crop.left - imageData.left),
    height: crop.height,
  }
  bottom = {
    top: imageData.top + crop.top + crop.height - imageData.top,
    left: imageData.left,
    width: imageData.width,
    height: imageData.height - crop.top - crop.height + imageData.top,
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
