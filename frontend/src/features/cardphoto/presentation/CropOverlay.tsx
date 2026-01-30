import React from 'react'
import clsx from 'clsx'
import styles from './CropOverlay.module.scss'
import type { LayoutOrientation } from '@layout/domain/types'

import type { ImageLayer, CropLayer } from '../domain/types'
import { number } from 'zod'

interface CropOverlayProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropLayer,
  imageLayer,
}) => {
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
    case 0:
      size.left = imageLayer.meta.width / 2 + dx - cropLayer.meta.width / 2
      size.top = imageLayer.meta.height / 2 + dy - cropLayer.meta.height / 2
      size.width = cropLayer.meta.width
      size.height = cropLayer.meta.height
      break
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
  }

  return (
    <div
      className={styles.overlay}
      style={{
        left: `${size.left}px`,
        top: `${size.top}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    />
  )
}
