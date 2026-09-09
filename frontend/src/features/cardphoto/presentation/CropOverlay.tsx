import React from 'react'
import { cropHoleInImageSpace } from '../application/helpers/cropMath'
import styles from './CropOverlay.module.scss'
import type { ImageLayer, CropLayer } from '../domain/types'

interface CropOverlayProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
}

/**
 * Dim around the crop window via four edge rects (no 5000px box-shadow).
 * Parent `.cropMask` is image-sized; hole is in image-local coords.
 */
export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropLayer,
  imageLayer,
}) => {
  const hole = cropHoleInImageSpace(cropLayer, imageLayer)
  const imgW = imageLayer.meta.width
  const imgH = imageLayer.meta.height

  return (
    <div className={styles.dim} aria-hidden>
      <div
        className={styles.edge}
        style={{ left: 0, top: 0, width: imgW, height: Math.max(0, hole.top) }}
      />
      <div
        className={styles.edge}
        style={{
          left: 0,
          top: hole.top,
          width: Math.max(0, hole.left),
          height: Math.max(0, hole.height),
        }}
      />
      <div
        className={styles.edge}
        style={{
          left: hole.left + hole.width,
          top: hole.top,
          width: Math.max(0, imgW - hole.left - hole.width),
          height: Math.max(0, hole.height),
        }}
      />
      <div
        className={styles.edge}
        style={{
          left: 0,
          top: hole.top + hole.height,
          width: imgW,
          height: Math.max(0, imgH - hole.top - hole.height),
        }}
      />
    </div>
  )
}
