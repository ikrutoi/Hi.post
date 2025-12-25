import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { useLayoutFacade } from '@layout/application/facades'
import { useCardphotoFacade } from '../application/facades'
import { useImageLoader } from '../application/hooks'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import styles from './ImageCrop.module.scss'
import type { ImageMeta } from '../domain/types'

export const ImageCrop = () => {
  const { state: stateCardphoto, actions: actionsCardphoto } =
    useCardphotoFacade()
  const { activeImage, shouldOpenFileDialog, isLoading } = stateCardphoto

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const src = activeImage?.url || ''
  const alt = activeImage?.id || 'Placeholder'

  const { imageData, isReady, hasError } = useImageLoader(
    src,
    sizeCard.width,
    sizeCard.height
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const cropAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldOpenFileDialog) {
      inputRef.current?.click()
      actionsCardphoto.resetFileDialog()
    }
  }, [shouldOpenFileDialog])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      actionsCardphoto.cancelFileDialog()
      return
    }

    actionsCardphoto.markLoading()

    const url = URL.createObjectURL(file)
    const imageMeta: ImageMeta = {
      id: `${file.name}-${file.lastModified}`,
      source: 'user',
      role: 'original',
      url,
      timestamp: file.lastModified ?? Date.now(),
      width: 0,
      height: 0,
    }
    actionsCardphoto.uploadImage(imageMeta)
  }

  const shouldShowRealImage = !!src && isReady && imageData && !hasError

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
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />

      <div
        className={styles.cropContainer}
        style={{
          width: sizeCard.width,
          height: sizeCard.height,
          position: 'relative',
        }}
      >
        {!activeImage && (
          <img
            src={placeholderImage}
            alt="Placeholder"
            className={clsx(styles.cropImage, styles.cropImageVisible)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              left: 0,
              top: 0,
            }}
          />
        )}

        {shouldShowRealImage && (
          <img
            src={src}
            alt={alt}
            className={clsx(styles.cropImage, styles.cropImageVisible)}
            style={{
              position: 'absolute',
              width: `${imageData!.width}px`,
              height: `${imageData!.height}px`,
              left: `${imageData!.left}px`,
              top: `${imageData!.top}px`,
            }}
          />
        )}

        {stateCardphoto.isComplete && (
          <div className={styles.overlay} ref={overlayRef} />
        )}

        {stateCardphoto.isComplete && (
          <div
            ref={cropAreaRef}
            className={styles.cropArea}
            style={{
              top: `0px`,
              left: `0px`,
              width: `100px`,
              height: `100px`,
            }}
          >
            <div className={styles.cropResizeHandle} />
          </div>
        )}

        {isLoading && (
          <div
            className={clsx(styles.loaderOverlay, styles.loaderOverlayVisible)}
          >
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  )
}
