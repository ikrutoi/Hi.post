import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { CropArea } from './CropArea'
import { CropOverlay } from './CropOverlay'
import { useAppSelector } from '@app/hooks'
import { useLayoutFacade } from '@layout/application/facades'
import {
  useCardphotoFacade,
  useCardphotoUiFacade,
  useCardphotoCropFacade,
} from '../application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { STOCK_IMAGES } from '@shared/assets/stock'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { useImageLoader, useImageUpload } from '../application/hooks'
import { calculateInitialCrop } from '../application/helpers'
import { selectTransformedImage } from '../infrastructure/selectors'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { state: stateCardphoto, actions: actionsCardphoto } =
    useCardphotoFacade()

  const { state: stateCardphotoUi, actions: actionsCardphotoUi } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = stateCardphotoUi

  const { state: stateCardphotoCrop, actions: actionsCardphotoCrop } =
    useCardphotoCropFacade()
  const { crop } = stateCardphotoCrop
  const { reset: resetCrop, update: updateCrop } = actionsCardphotoCrop

  const { state: stateToolbar } = useToolbarFacade('cardphoto')

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)
  // const [extrasVisible, setExtrasVisible] = useState(false)

  const aspectRatio = CARD_SCALE_CONFIG.aspectRatio

  const transformedImage = useAppSelector(selectTransformedImage)

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

  // useEffect(() => {
  //   if (stateToolbar.crop === 'active' && imageData) {
  //     const crop = calculateInitialCrop(
  //       imageData.width,
  //       imageData.height,
  //       aspectRatio
  //     )
  //     reset(crop.width, crop.height, aspectRatio, crop.left, crop.top)
  //   }
  // }, [stateToolbar.crop, imageData, aspectRatio, reset])

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

  useEffect(() => {
    if (isReady && imageData && !hasError) {
      if (!crop.width || !crop.height) {
        const left = imageData.aspectRatio < aspectRatio ? 0 : imageData.left
        const top = imageData.aspectRatio > aspectRatio ? 0 : imageData.top

        resetCrop(
          imageData.width,
          imageData.height,
          imageData.aspectRatio,
          left,
          top
        )
      } else {
        updateCrop(crop)
      }
    }
  }, [
    isReady,
    imageData,
    hasError,
    resetCrop,
    updateCrop,
    crop,
    stateCardphoto.activeImage?.id,
  ])

  useEffect(() => {
    setLoaded(false)
  }, [src])

  // const handleImageLoad = () => {
  //   setLoaded(true)
  //   setTimeout(() => setExtrasVisible(true), 1000)
  // }

  const handleFileChange = useImageUpload(
    actionsCardphoto.uploadImage,
    actionsCardphotoUi.cancelFileDialog,
    actionsCardphotoUi.markLoading
  )

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
        {!transformedImage && (
          <img
            src={placeholderImage}
            onLoad={() => setLoaded(true)}
            alt="Placeholder"
            className={clsx(styles.cropImage, styles.fadeInVisible)}
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
            onLoad={() => setLoaded(true)}
            className={clsx(
              styles.cropImage,
              loaded ? styles.fadeInVisible : styles.fadeIn
            )}
            style={{
              position: 'absolute',
              width: `${imageData?.width ?? sizeCard.width}px`,
              height: `${imageData?.height ?? sizeCard.height}px`,
              left: `${imageData!.left}px`,
              top: `${imageData!.top}px`,
            }}
          />
        )}

        {/* {stateCardphoto.isComplete && (
          <div className={styles.overlay} ref={overlayRef} />
        )} */}

        {loaded && imageData && stateToolbar.crop === 'active' && (
          <CropOverlay crop={crop} imageData={imageData} />
        )}

        {loaded && stateToolbar.crop === 'active' && (
          <CropArea
            crop={{
              top: Number(((imageData?.top ?? 0) + crop.top).toFixed(2)),
              left: Number(((imageData?.left ?? 0) + crop.left).toFixed(2)),
              width: crop.width,
              height: crop.height,
              aspectRatio,
            }}
            imageData={imageData}
            onChange={(newCrop) => updateCrop(newCrop)}
          />
        )}
      </div>
    </div>
  )
}
