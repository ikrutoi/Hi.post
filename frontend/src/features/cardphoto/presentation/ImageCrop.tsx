import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { useLayoutFacade } from '@layout/application/facades'
import {
  useCardphotoFacade,
  useCardphotoUiFacade,
} from '../application/facades'
import { STOCK_IMAGES } from '@shared/assets/stock'
import { useImageLoader, useImageUpload } from '../application/hooks'
import { selectTransformedImage } from '../infrastructure/selectors'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const selector = useAppSelector

  const { state: stateCardphoto, actions: actionsCardphoto } =
    useCardphotoFacade()

  const { state: stateCardphotoUi, actions: actionsCardphotoUi } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog, isLoading } = stateCardphotoUi

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const transformedImage = selector(selectTransformedImage)

  const src = transformedImage?.url || ''
  const alt = transformedImage?.id || 'Placeholder'

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
      actionsCardphotoUi.resetFileDialog()
    }
  }, [shouldOpenFileDialog])

  useEffect(() => {
    if (!stateCardphoto.activeImage) {
      const randomImage =
        STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)]
      actionsCardphoto.setImage(randomImage)
    }
  }, [])

  const handleFileChange = useImageUpload(
    actionsCardphoto.uploadImage,
    actionsCardphotoUi.cancelFileDialog,
    actionsCardphotoUi.markLoading
  )

  const shouldShowRealImage = !!src && isReady && imageData && !hasError

  console.log('transformedImage', transformedImage)

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
        {!transformedImage && (
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
