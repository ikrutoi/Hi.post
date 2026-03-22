import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './CropArea.module.scss'
import {
  useInteractionState,
  useGlobalListeners,
  useCropDrag,
  useCropResize,
} from '../application/hooks'
import { getQualityColor } from '../application/helpers'
import type { ImageLayer, CropLayer, ImageMeta } from '../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

interface CropAreaProps {
  cropLayer: CropLayer
  imageLayer: ImageLayer
  orientation: LayoutOrientation
  originalImage: ImageMeta
  /** Только локальный превью (оверлей + стейт), без Redux — иначе лаг Redux откатывает кроп. */
  onPreviewChange: (newCrop: CropLayer) => void
  /** Один раз в конце жеста (mouseup / touchend). */
  onCommit: (finalCrop: CropLayer) => void
}

export const CropArea: React.FC<CropAreaProps> = ({
  cropLayer,
  imageLayer,
  orientation,
  originalImage,
  onPreviewChange,
  onCommit,
}) => {
  const [tempCrop, setTempCrop] = useState<CropLayer>(cropLayer)
  const { interactingRef, lastCropRef, begin, end, setLast } =
    useInteractionState(cropLayer)
  const { attach } = useGlobalListeners()

  const startDrag = useCropDrag(
    tempCrop,
    imageLayer,
    setTempCrop,
    setLast,
    onPreviewChange,
    onCommit,
    begin,
    end,
    attach,
    lastCropRef,
    orientation,
  )

  const startResize = useCropResize(
    tempCrop,
    imageLayer,
    setTempCrop,
    setLast,
    onPreviewChange,
    onCommit,
    begin,
    end,
    attach,
    lastCropRef,
    originalImage,
    orientation,
  )

  useEffect(() => {
    if (!interactingRef.current) {
      setTempCrop(cropLayer)
      setLast(cropLayer)
    }
  }, [cropLayer])

  /**
   * Цвет ручек по qualityProgress (как шкала индикатора).
   * Во время drag/resize цвет задаёт только useCropResize (синхронно в pointermove);
   * иначе этот эффект после ре-рендера перезаписывал бы CSS var устаревшим progress → мигание/красный.
   */
  useEffect(() => {
    if (interactingRef.current) return
    const p = Math.max(
      0,
      Math.min(100, tempCrop.meta.qualityProgress ?? 0),
    )
    document.documentElement.style.setProperty(
      '--crop-handle-color',
      getQualityColor(p),
    )
  }, [tempCrop.meta.qualityProgress])

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--crop-handle-color')
    }
  }, [])

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
