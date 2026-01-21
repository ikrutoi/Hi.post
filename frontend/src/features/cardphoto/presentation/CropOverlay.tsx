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
  const sizeOverlay = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  }

  switch (imageLayer.orientation) {
    case 0:
      sizeOverlay.left = cropLayer.x - imageLayer.left
      sizeOverlay.top = cropLayer.y - imageLayer.top
      sizeOverlay.width = cropLayer.meta.width
      sizeOverlay.height = cropLayer.meta.height
      break
    case 90:
      sizeOverlay.left = cropLayer.y - imageLayer.top
      sizeOverlay.top = Math.round(
        imageLayer.left -
          cropLayer.x +
          imageLayer.meta.width -
          cropLayer.meta.width,
      )
      sizeOverlay.width = cropLayer.meta.height
      sizeOverlay.height = cropLayer.meta.width
      break
    case 180:
      sizeOverlay.left = Math.round(
        imageLayer.left -
          cropLayer.x +
          imageLayer.meta.width -
          cropLayer.meta.width,
      )
      sizeOverlay.top = Math.round(
        imageLayer.top -
          cropLayer.y +
          (imageLayer.meta.height - cropLayer.meta.height),
      )
      sizeOverlay.width = cropLayer.meta.width
      sizeOverlay.height = cropLayer.meta.height
      break
    case 270:
      sizeOverlay.left = Math.round(
        imageLayer.top -
          cropLayer.y -
          cropLayer.meta.height +
          imageLayer.meta.height,
      )
      sizeOverlay.top = Math.round(cropLayer.x - imageLayer.left)
      sizeOverlay.width = cropLayer.meta.height
      sizeOverlay.height = cropLayer.meta.width
      break
  }

  return (
    <div
      className={clsx(styles.overlay)}
      style={{
        left: `${sizeOverlay.left}px`,
        top: `${sizeOverlay.top}px`,
        width: `${sizeOverlay.width}px`,
        height: `${sizeOverlay.height}px`,
      }}
    />
  )
}
