import React from 'react'
import clsx from 'clsx'
import styles from './CropOverlay.module.scss'
import { roundTo } from '@shared/utils/layout'
import type { ImageLayer, CropLayer } from '../domain/types'

interface CropOverlayProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  cropLayer,
  imageLayer,
}) => {
  const rawDiffTopY = roundTo(cropLayer.y - imageLayer.top, 2)
  const top = {
    top: imageLayer.top,
    left: imageLayer.left,
    width: imageLayer.meta.width,
    height: rawDiffTopY < 1 ? 0 : rawDiffTopY,
  }

  const rawDiffLeftX = roundTo(cropLayer.x - imageLayer.left, 2)
  const left = {
    top: cropLayer.y,
    left: imageLayer.left,
    width: rawDiffLeftX < 1 ? 0 : rawDiffLeftX,
    height: cropLayer.meta.height,
  }

  const rawDiffRightX = roundTo(
    imageLayer.left +
      imageLayer.meta.width -
      (cropLayer.x + cropLayer.meta.width),
    2
  )
  const right = {
    top: cropLayer.y,
    left: cropLayer.x + cropLayer.meta.width,
    width: rawDiffRightX < 1 ? 0 : rawDiffRightX,
    height: cropLayer.meta.height,
  }

  const rawDiffBottomY = roundTo(
    imageLayer.top +
      imageLayer.meta.height -
      (cropLayer.y + cropLayer.meta.height),
    2
  )
  const bottom = {
    top: cropLayer.y + cropLayer.meta.height,
    left: imageLayer.left,
    width: imageLayer.meta.width,
    height: rawDiffBottomY < 1 ? 0 : rawDiffBottomY,
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
