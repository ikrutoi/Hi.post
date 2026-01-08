import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { CropArea } from './CropArea'
import { CropOverlay } from './CropOverlay'
import { useLayoutFacade } from '@layout/application/facades'
import {
  useCardphotoFacade,
  useCardphotoUiFacade,
} from '../application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useImageMetaLoader } from '../application/hooks/useImageMetaLoader'
import { useImageLayer } from '../application/hooks/useImageLayer'
import {
  useImageUpload,
  useFileDialog,
  useCropState,
} from '../application/hooks'
import { useCardphotoSrc } from '../application/hooks/useCardphotoSrc'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { state: cardphotoState, actions: cardphotoActions } =
    useCardphotoFacade()
  const { init, setUserImage, addOp } = cardphotoActions

  console.log('ImageCrop', cardphotoState)

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState

  const { state: toolbarState } = useToolbarFacade('cardphoto')
  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)

  const { src, alt } = useCardphotoSrc(cardphotoState.state)

  useEffect(() => {
    init()
  }, [])

  const { imageMeta, isReady, hasError } = useImageMetaLoader(src)
  const imageLayer = useImageLayer(imageMeta, sizeCard)

  const { inputRef, handleBlur } = useFileDialog()

  useEffect(() => {
    if (shouldOpenFileDialog) {
      inputRef.current?.click()
      cardphotoUiActions.resetFileDialog()
    }
  }, [shouldOpenFileDialog, cardphotoUiActions])

  useEffect(() => {
    setLoaded(false)
  }, [src])

  const handleFileChange = useImageUpload(
    setUserImage,
    cardphotoUiActions.markLoading
  )

  const shouldShowImage = !!src && isReady && imageMeta && !hasError

  const [tempCrop, setTempCrop] = useCropState(
    toolbarState.crop,
    imageLayer,
    sizeCard,
    cardphotoState.currentConfig?.crop ?? null
  )

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
        {shouldShowImage && imageLayer && (
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
              width: `${imageLayer.meta.width}px`,
              height: `${imageLayer.meta.height}px`,
              left: `${imageLayer.left}px`,
              top: `${imageLayer.top}px`,
            }}
          />
        )}

        {loaded &&
          imageLayer &&
          toolbarState.crop === 'active' &&
          cardphotoState.currentConfig?.crop && (
            <>
              {tempCrop && (
                <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
              )}

              <CropArea
                cropLayer={cardphotoState.currentConfig?.crop}
                imageLayer={imageLayer}
                orientation={sizeCard.orientation}
                onChange={(newCrop) => {
                  setTempCrop(newCrop)
                }}
                onCommit={(finalCrop) => {
                  addOp({
                    type: 'operation',
                    payload: {
                      config: {
                        ...cardphotoState.currentConfig!,
                        crop: finalCrop,
                      },
                    },
                  })
                }}
              />
            </>
          )}
      </div>
    </div>
  )
}
