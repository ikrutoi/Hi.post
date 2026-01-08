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
  const top = {
    top: imageLayer.top,
    left: imageLayer.left,
    width: imageLayer.meta.width,
    height: Math.max(0, cropLayer.y - imageLayer.top),
    // height: cropLayer.y - imageLayer.top,
  }

  const left = {
    top: imageLayer.top + cropLayer.y - imageLayer.top,
    left: imageLayer.left,
    width: cropLayer.x - imageLayer.left,
    height: cropLayer.meta.height,
  }

  const right = {
    top: imageLayer.top + cropLayer.y - imageLayer.top,
    left: cropLayer.x + cropLayer.meta.width,
    width:
      imageLayer.meta.width -
      cropLayer.meta.width -
      (cropLayer.x - imageLayer.left),
    height: cropLayer.meta.height,
  }

  const bottom = {
    top: cropLayer.y + cropLayer.meta.height,
    left: imageLayer.left,
    width: imageLayer.meta.width,
    height:
      imageLayer.meta.height +
      imageLayer.top -
      cropLayer.y -
      cropLayer.meta.height,
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
