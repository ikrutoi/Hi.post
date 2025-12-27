import React from 'react'
import styles from './CropOverlay.module.scss'

interface CropOverlayProps {
  crop: { top: number; left: number; width: number; height: number }
  imageData: { width: number; height: number; left: number; top: number }
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  crop,
  imageData,
}) => {
  return (
    <>
      <div
        className={styles.overlay}
        style={{
          top: imageData.top,
          left: imageData.left,
          width: imageData.width,
          height: crop.top,
        }}
      />

      <div
        className={styles.overlay}
        style={{
          top: imageData.top + crop.top,
          left: imageData.left,
          width: crop.left,
          height: crop.height,
        }}
      />

      <div
        className={styles.overlay}
        style={{
          top: imageData.top + crop.top,
          left: imageData.left + crop.left + crop.width,
          width: imageData.width - (crop.left + crop.width),
          height: crop.height,
        }}
      />

      <div
        className={styles.overlay}
        style={{
          top: imageData.top + crop.top + crop.height,
          left: imageData.left,
          width: imageData.width,
          height: imageData.height - (crop.top + crop.height),
        }}
      />
    </>
  )
}
