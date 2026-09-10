import React from 'react'
import styles from './CropOverlay.module.scss'
import type { CropLayer } from '../domain/types'

interface CropOverlayProps {
  cropLayer: CropLayer
  stageWidth: number
  stageHeight: number
}

/**
 * Dim around the crop window via four edge rects (no 5000px box-shadow).
 * Uses the same stage coordinates as `CropArea` so the hole tracks drag/resize.
 */
export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropLayer,
  stageWidth,
  stageHeight,
}) => {
  const { x, y, meta } = cropLayer
  const { width, height } = meta

  return (
    <div className={styles.dim} aria-hidden>
      <div
        className={styles.edge}
        style={{ left: 0, top: 0, width: stageWidth, height: Math.max(0, y) }}
      />
      <div
        className={styles.edge}
        style={{
          left: 0,
          top: y,
          width: Math.max(0, x),
          height: Math.max(0, height),
        }}
      />
      <div
        className={styles.edge}
        style={{
          left: x + width,
          top: y,
          width: Math.max(0, stageWidth - x - width),
          height: Math.max(0, height),
        }}
      />
      <div
        className={styles.edge}
        style={{
          left: 0,
          top: y + height,
          width: stageWidth,
          height: Math.max(0, stageHeight - y - height),
        }}
      />
    </div>
  )
}
