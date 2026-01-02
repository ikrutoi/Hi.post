import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { CropArea } from './CropArea'
import { CropOverlay } from './CropOverlay'
import { useLayoutFacade } from '@layout/application/facades'
import {
  useCardphotoFacade,
  useCardphotoUiFacade,
} from '../application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import {
  useImageLoader,
  useImageUpload,
  useFileDialog,
} from '../application/hooks'
import styles from './ImageCrop.module.scss'
import { useCardphotoSrc } from '../application/hooks/useCardphotoSrc'

export const ImageCrop = () => {
  const { state: stateCardphoto, actions: actionsCardphoto } =
    useCardphotoFacade()
  const workingConfig = stateCardphoto.history?.workingConfig
  const crop = workingConfig?.crop
  const { initCardphoto, updateCrop } = actionsCardphoto

  const { state: stateCardphotoUi, actions: actionsCardphotoUi } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = stateCardphotoUi

  const { state: stateToolbar } = useToolbarFacade('cardphoto')
  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)

  const { src, alt } = useCardphotoSrc(stateCardphoto.history)

  useEffect(() => {
    initCardphoto()
  }, [])

  const { imageData, isReady, hasError } = useImageLoader(
    src,
    sizeCard.width,
    sizeCard.height
  )
  const { inputRef, handleBlur } = useFileDialog()

  useEffect(() => {
    if (shouldOpenFileDialog) {
      inputRef.current?.focus()
      inputRef.current?.click()
      actionsCardphotoUi.resetFileDialog()
    }
  }, [shouldOpenFileDialog])

  useEffect(() => {
    setLoaded(false)
  }, [src])

  const handleFileChange = useImageUpload(
    actionsCardphoto.uploadImage,
    actionsCardphotoUi.cancelFileDialog,
    actionsCardphotoUi.markLoading
  )

  const shouldShowImage = !!src && isReady && imageData && !hasError

  return (
    <div
      className={styles.imageCrop}
      style={{ width: `${sizeCard.width}px`, height: `${sizeCard.height}px` }}
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
            left: `${imageData?.left ?? 0}px`,
            top: `${imageData?.top ?? 0}px`,
          }}
        />

        {loaded && imageData && stateToolbar.crop === 'active' && crop && (
          <>
            <CropOverlay crop={crop} imageData={imageData} />
            <CropArea
              crop={crop}
              imageData={imageData}
              onChange={(newCrop) => updateCrop(newCrop)}
            />
          </>
        )}
      </div>
    </div>
  )
}
