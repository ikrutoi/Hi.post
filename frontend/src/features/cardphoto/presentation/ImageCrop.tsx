import React, { useEffect, useRef, useState } from 'react'
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
  const { init, setUserImage, addOp, uploadImage } = cardphotoActions

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState

  const { state: toolbarState } = useToolbarFacade('cardphoto')
  const { state: iconStates } = toolbarState

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)

  const { src, alt } = useCardphotoSrc(cardphotoState.state)

  const processedSrcRef = useRef<string | null>(null)

  useEffect(() => {
    init()
  }, [])

  const { imageMeta, isReady, loadedUrl } = useImageMetaLoader(src)

  useEffect(() => {
    const isUserFile = src.startsWith('blob:') || src.startsWith('data:')

    if (isReady && imageMeta && isUserFile && loadedUrl === src) {
      if (processedSrcRef.current !== src) {
        processedSrcRef.current = src
        uploadImage(imageMeta)
      }
    }
  }, [isReady, imageMeta, src, loadedUrl])

  const imageLayer = cardphotoState.currentConfig?.image || null

  const { inputRef, trackCancel } = useFileDialog()

  useEffect(() => {
    if (shouldOpenFileDialog) {
      trackCancel()
      inputRef.current?.click()
      cardphotoUiActions.resetFileDialog()
    }
  }, [shouldOpenFileDialog, cardphotoUiActions, trackCancel])

  useEffect(() => {
    setLoaded(false)
  }, [src])

  const handleFileChange = useImageUpload(
    setUserImage,
    cardphotoUiActions.markLoading
  )

  const shouldShowImage = !!src && imageMeta

  // console.log('should', shouldShowImage)

  const [tempCrop, setTempCrop] = useCropState(
    iconStates.crop,
    cardphotoState.currentConfig?.crop ?? null
    // cardphotoState.cardOrientation
  )

  const currentQuality = tempCrop?.meta.quality ?? 'low'
  const currentProgress = tempCrop?.meta.qualityProgress ?? 0

  console.log('Realtime Quality', currentQuality, currentProgress)

  const imageStyle: React.CSSProperties | undefined = imageLayer
    ? {
        position: 'absolute',
        left: `${imageLayer.left}px`,
        top: `${imageLayer.top}px`,
        width: `${
          imageLayer.orientation === 90 || imageLayer.orientation === 270
            ? imageLayer.meta.height
            : imageLayer.meta.width
        }px`,
        height: `${
          imageLayer.orientation === 90 || imageLayer.orientation === 270
            ? imageLayer.meta.width
            : imageLayer.meta.height
        }px`,
        transform: `rotate(${imageLayer.orientation}deg)`,
        transformOrigin: 'center center',
        marginLeft:
          imageLayer.orientation === 90 || imageLayer.orientation === 270
            ? `${(imageLayer.meta.width - imageLayer.meta.height) / 2}px`
            : 0,
        marginTop:
          imageLayer.orientation === 90 || imageLayer.orientation === 270
            ? `${(imageLayer.meta.height - imageLayer.meta.width) / 2}px`
            : 0,
        maxWidth: 'none',
      }
    : undefined

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
        onChange={handleFileChange}
      />

      <div
        // key={sizeCard.orientation}
        key={src}
        className={styles.cropContainer}
        style={{
          width: `${sizeCard.width}px`,
          height: `${sizeCard.height}px`,
          // position: 'relative',
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
            style={imageStyle}
          />
        )}
        {loaded && imageLayer && iconStates.crop === 'active' && tempCrop && (
          <>
            <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
            {imageMeta && (
              <CropArea
                cropLayer={tempCrop}
                imageLayer={imageLayer}
                orientation={sizeCard.orientation}
                imageMeta={imageMeta}
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
