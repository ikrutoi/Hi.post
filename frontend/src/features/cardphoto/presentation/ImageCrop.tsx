import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { CropArea } from './CropArea'
import { CropOverlay } from './CropOverlay'
import { useLayoutFacade } from '@layout/application/facades'
import {
  useCardphotoFacade,
  useCardphotoUiFacade,
  useCardphotoCropFacade,
} from '../application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import {
  useImageLoader,
  useImageUpload,
  useCropInitialization,
  useFileDialog,
} from '../application/hooks'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { state: stateCardphoto, actions: actionsCardphoto } =
    useCardphotoFacade()
  const finalImage = stateCardphoto.history?.finalImage
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

  const [startImage, setStartImage] = useState<string>('')

  useEffect(() => {
    if (stateCardphoto.history?.finalImage?.url) {
      setStartImage(stateCardphoto.history.finalImage.url)
    } else if (stateCardphoto.history?.original?.url) {
      setStartImage(stateCardphoto.history.original.url)
    } else {
      setStartImage('')
    }
  }, [stateCardphoto.history?.finalImage, stateCardphoto.history?.original])

  const src = startImage
  const alt = finalImage?.id || 'Placeholder'

  useEffect(() => {
    initCardphoto()
  }, [])

  const { imageData, isReady, hasError } = useImageLoader(
    src,
    sizeCard.width,
    sizeCard.height,
    stateCardphoto.history?.finalImage?.id
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
    stateCardphoto.history?.finalImage?.id
    // stateCardphoto.activeImage?.id
  )

  useEffect(() => {
    setLoaded(false)
  }, [src])

  console.log('ImageCrop history', stateCardphoto.history)

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
        {shouldShowRealImage && (
          <img
            src={shouldShowRealImage ? src : placeholderImage}
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
