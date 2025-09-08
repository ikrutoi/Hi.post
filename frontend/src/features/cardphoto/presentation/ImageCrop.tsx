import React from 'react'
import styles from './ImageCrop.module.scss'
import { useImageCropFacade } from '../application/facades/useImageCropFacade'
import { useCropEvents } from '../application/hooks/useCropEvents'
// import {
//   handleMouseMoveDrag,
//   handleMouseUpDrag,
//   handleMouseDownDrag,
//   handleMouseDownResize,
// } from './events'
import type { SizeCard } from '../domain/image'

interface ImageCropProps {
  sizeCard: SizeCard
}

export const ImageCrop: React.FC<ImageCropProps> = ({ sizeCard }) => {
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
  } = useImageCropFacade(sizeCard)

  const { handleMouseDownDrag, handleMouseDownResize } = useCropEvents({
    imgRef: refs.imgRef,
    crop,
    setCrop,
    scaleX,
    scaleY,
    aspectRatio: 142 / 100,
    isResizing,
    setIsResizing,
    isDragging,
    setIsDragging,
    lastMousePosition,
    setLastMousePosition,
  })

  return (
    <div
      className={styles.imageCrop}
      onMouseMove={(evt) =>
        handleMouseMoveDrag(
          evt,
          isDragging,
          refs.imgRef,
          scaleX,
          scaleY,
          lastMousePosition,
          crop,
          setCrop,
          setLastMousePosition
        )
      }
      onMouseUp={() => handleMouseUpDrag(setIsDragging)}
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

      {image.url && (
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
              onMouseDown={(e) =>
                handleMouseDownDrag(
                  e,
                  setIsDragging,
                  refs.imgRef,
                  setLastMousePosition,
                  isResizing
                )
              }
            >
              <div
                className={styles.cropResizeHandle}
                onMouseDown={(e) =>
                  handleMouseDownResize(
                    e,
                    setIsResizing,
                    crop,
                    scaleX,
                    scaleY,
                    142 / 100,
                    refs.imgRef,
                    setCrop
                  )
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
