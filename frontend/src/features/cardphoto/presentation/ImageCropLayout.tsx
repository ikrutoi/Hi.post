import React from 'react'
import { useImageCropFacade } from '../application/facadesLayout'
import { useLayoutFacade } from '@layout/application/facades'
import { useCropDrag, useCropResize } from '../application/hooksLayer'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { size } = useLayoutFacade()
  const { sizeCard } = size
  const {
    image,
    crop,
    scaleX,
    scaleY,
    isCropVisibly,
    isDragging,
    isResizing,
    lastMousePosition,
    setCrop,
    setLastMousePosition,
    setIsDragging,
    setIsResizing,
    refs,
    handlers,
  } = useImageCropFacade()

  const { handleMouseDownDrag } = useCropDrag({
    imgRef: refs.imgRef,
    crop,
    setCrop,
    scaleX,
    scaleY,
    isDragging,
    setIsDragging,
    lastMousePosition,
    setLastMousePosition,
  })

  const { handleMouseDownResize } = useCropResize({
    imgRef: refs.imgRef,
    crop,
    setCrop,
    scaleX,
    scaleY,
    aspectRatio: 142 / 100,
    setIsResizing,
  })

  return (
    <div
      className={styles.imageCrop}
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handlers.handleFileChange}
        ref={refs.inputRef}
        style={{ display: 'none' }}
      />

      {image && image.url && (
        <div className={styles.cropContainer}>
          <img
            ref={refs.imgRef}
            src={image.url}
            alt="Source"
            className={styles.cropImage}
          />

          {isCropVisibly && (
            <div className={styles.overlay} ref={refs.overlayRef} />
          )}

          {isCropVisibly && (
            <div
              ref={refs.cropAreaRef}
              className={styles.cropArea}
              style={{
                top: `${crop.y / scaleX}px`,
                left: `${crop.x / scaleY}px`,
                width: `${crop.width / scaleX}px`,
                height: `${crop.height / scaleY}px`,
              }}
              onMouseDown={handleMouseDownDrag}
            >
              <div
                className={styles.cropResizeHandle}
                onMouseDown={handleMouseDownResize}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
