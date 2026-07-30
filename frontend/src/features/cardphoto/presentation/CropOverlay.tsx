import React from 'react'
import styles from './CropOverlay.module.scss'
import type { ImageLayer, CropLayer } from '../domain/types'

interface CropOverlayProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
}

function cropHoleInImageSpace(
  cropLayer: CropLayer,
  imageLayer: ImageLayer,
): { left: number; top: number; width: number; height: number } {
  const dx =
    cropLayer.x +
    cropLayer.meta.width / 2 -
    (imageLayer.left + imageLayer.meta.width / 2)
  const dy =
    cropLayer.y +
    cropLayer.meta.height / 2 -
    (imageLayer.top + imageLayer.meta.height / 2)

  const size = { left: 0, top: 0, width: 0, height: 0 }

  switch (imageLayer.rotation) {
    case 90:
      size.left = imageLayer.meta.width / 2 + dy - cropLayer.meta.height / 2
      size.top = imageLayer.meta.height / 2 - dx - cropLayer.meta.width / 2
      size.width = cropLayer.meta.height
      size.height = cropLayer.meta.width
      break
    case 180:
      size.left = imageLayer.meta.width / 2 - dx - cropLayer.meta.width / 2
      size.top = imageLayer.meta.height / 2 - dy - cropLayer.meta.height / 2
      size.width = cropLayer.meta.width
      size.height = cropLayer.meta.height
      break
    case 270:
      size.left = imageLayer.meta.width / 2 - dy - cropLayer.meta.height / 2
      size.top = imageLayer.meta.height / 2 + dx - cropLayer.meta.width / 2
      size.width = cropLayer.meta.height
      size.height = cropLayer.meta.width
      break
    default:
      size.left = imageLayer.meta.width / 2 + dx - cropLayer.meta.width / 2
      size.top = imageLayer.meta.height / 2 + dy - cropLayer.meta.height / 2
      size.width = cropLayer.meta.width
      size.height = cropLayer.meta.height
      break
  }

  return size
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
