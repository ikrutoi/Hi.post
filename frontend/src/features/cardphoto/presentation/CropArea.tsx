import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './CropArea.module.scss'
import {
  useInteractionState,
  useGlobalListeners,
  useCropDrag,
  useCropResize,
} from '../application/hooks'
import type { ImageLayer, CropLayer } from '../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

interface CropAreaProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
  orientation: LayoutOrientation
  onChange: (newCrop: CropLayer) => void
  onCommit: (finalCrop: CropLayer) => void
}

export const CropArea: React.FC<CropAreaProps> = ({
  cropLayer,
  imageLayer,
  orientation,
  onChange,
  onCommit,
}) => {
  const [tempCrop, setTempCrop] = useState<CropLayer>(cropLayer)
  const { interactingRef, lastCropRef, begin, end, setLast } =
    useInteractionState(cropLayer)
  const { attach } = useGlobalListeners()

  useEffect(() => {
    if (!interactingRef.current) {
      setTempCrop(cropLayer)
      setLast(cropLayer)
    }
  }, [cropLayer])

  const startDrag = useCropDrag(
    tempCrop,
    imageLayer,
    setTempCrop,
    setLast,
    onChange,
    onCommit,
    begin,
    end,
    attach,
    lastCropRef,
    orientation
  )

  const startResize = useCropResize(
    tempCrop,
    imageLayer,
    setTempCrop,
    setLast,
    onChange,
    onCommit,
    begin,
    end,
    attach,
    lastCropRef,
    orientation
  )

  useEffect(() => {
    if (!interactingRef.current) {
      setTempCrop(cropLayer)
      setLast(cropLayer)
    }
  }, [cropLayer])

  return (
    <div
      className={styles.cropArea}
      style={{
        top: `${tempCrop.y}px`,
        left: `${tempCrop.x}px`,
        width: `${tempCrop.meta.width}px`,
        height: `${tempCrop.meta.height}px`,
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        startDrag(e.clientX, e.clientY)
      }}
      onTouchStart={(e) => {
        e.preventDefault()
        e.stopPropagation()
        startDrag(e.touches[0].clientX, e.touches[0].clientY)
      }}
    >
      <div
        className={clsx(styles.handle, styles.handleTL)}
        style={{ left: 0, top: 0 }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('TL', e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('TL', e.touches[0].clientX, e.touches[0].clientY)
        }}
      />
      <div
        className={clsx(styles.handle, styles.handleTR)}
        style={{ right: 0, top: 0 }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('TR', e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('TR', e.touches[0].clientX, e.touches[0].clientY)
        }}
      />
      <div
        className={clsx(styles.handle, styles.handleBL)}
        style={{ left: 0, bottom: 0 }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('BL', e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('BL', e.touches[0].clientX, e.touches[0].clientY)
        }}
      />
      <div
        className={clsx(styles.handle, styles.handleBR)}
        style={{ right: 0, bottom: 0 }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('BR', e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          e.stopPropagation()
          startResize('BR', e.touches[0].clientX, e.touches[0].clientY)
        }}
      />
    </div>
  )
}
