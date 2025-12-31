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
import {
  useImageLoader,
  useImageUpload,
  useCropInitialization,
  useFileDialog,
} from '../application/hooks'
import { selectTransformedImage } from '../infrastructure/selectors'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { state: stateCardphoto, actions: actionsCardphoto } =
    useCardphotoFacade()
  const { initCardphoto } = actionsCardphoto

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

  const transformedImage = useAppSelector(selectTransformedImage)

  const src = transformedImage?.url || ''
  const alt = transformedImage?.id || 'Placeholder'

  useEffect(() => {
    initCardphoto()
  }, [])

  console.log('stateCardphoto', stateCardphoto)

  const { imageData, isReady, hasError } = useImageLoader(
    src,
    sizeCard.width,
    sizeCard.height,
    stateCardphoto.activeImage?.id
  )

  const { inputRef, handleBlur } = useFileDialog()

  useEffect(() => {
    if (shouldOpenFileDialog) {
      inputRef.current?.focus()
      inputRef.current?.click()
      actionsCardphotoUi.resetFileDialog()
    }
  }, [shouldOpenFileDialog])

  useCropInitialization(
    imageData,
    crop,
    resetCrop,
    isReady,
    hasError,
    stateCardphoto.activeImage?.id
  )

  useEffect(() => {
    setLoaded(false)
  }, [src])

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
        ref={inputRef}
        className={styles.imageInput}
        onBlur={handleBlur}
        onChange={handleFileChange}
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

        {loaded && imageData && stateToolbar.crop === 'active' && (
          <CropOverlay crop={crop} imageData={imageData} />
        )}

        {loaded && stateToolbar.crop === 'active' && (
          <CropArea
            crop={crop}
            imageData={imageData}
            onChange={(newCrop) => updateCrop(newCrop)}
          />
        )}
      </div>
    </div>
  )
}
