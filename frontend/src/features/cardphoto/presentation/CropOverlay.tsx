import React from 'react'
import clsx from 'clsx'
import styles from './CropOverlay.module.scss'
import type { ImageLayer, CropLayer } from '../domain/types'

interface CropOverlayProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropLayer,
  imageLayer,
}) => {
  const rawDiffTopY = Math.round(cropLayer.y - imageLayer.top)
  const rawDiffLeftX = Math.round(cropLayer.x - imageLayer.left)

  const isOrientationImage =
    imageLayer.orientation === 0 || imageLayer.orientation === 180
  const resultSize = isOrientationImage
    ? {
        left: rawDiffLeftX,
        top: rawDiffTopY,
        width: cropLayer.meta.width,
        height: cropLayer.meta.height,
      }
    : {
        left: rawDiffTopY,
        top: rawDiffLeftX,
        width: cropLayer.meta.height,
        height: cropLayer.meta.width,
      }

  return (
    <div
      className={clsx(styles.overlay)}
      style={{
        left: `${resultSize.left}px`,
        top: `${resultSize.top}px`,
        width: `${resultSize.width}px`,
        height: `${resultSize.height}px`,
      }}
    />
  )
}
