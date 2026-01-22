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
  useCurrentImageMeta,
} from '../application/hooks'
import { useCardphotoSrc } from '../application/hooks/useCardphotoSrc'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { state: cardphotoState, actions: cardphotoActions } =
    useCardphotoFacade()
  const { activeSourceImage } = cardphotoState
  const { init, setUserImage, addOp, uploadImage } = cardphotoActions

  const reduxCrop = cardphotoState.currentConfig?.crop

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState

  console.log('ImageCrop state', cardphotoState)

  const { state: toolbarState } = useToolbarFacade('cardphoto')
  const { state: iconStates } = toolbarState

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)

  const imageMeta = useCurrentImageMeta(cardphotoState.state)

  const { src, alt } = useCardphotoSrc(cardphotoState.state)

  const processedSrcRef = useRef<string | null>(null)

  const [tempCrop, setTempCrop] = useCropState(
    iconStates.crop,
    cardphotoState.currentConfig?.crop ?? null,
  )

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (reduxCrop) {
      setTempCrop(reduxCrop)
    }
  }, [reduxCrop, setTempCrop])

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
    cardphotoUiActions.markLoading,
  )

  const shouldShowImage = !!src && imageMeta

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

  if (!imageLayer) return

  // const isRotated =
  //   imageLayer.orientation === 90 || imageLayer.orientation === 270
  // const visualWidth = isRotated ? imageLayer.meta.height : imageLayer.meta.width
  // const visualHeight = isRotated
  //   ? imageLayer.meta.width
  //   : imageLayer.meta.height

  const maskStyle: React.CSSProperties = {
    ...imageStyle,
    overflow: 'hidden',
  }

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
        key={src}
        className={styles.cropContainer}
        style={{
          width: `${sizeCard.width}px`,
          height: `${sizeCard.height}px`,
        }}
      >
        {shouldShowImage && imageLayer && (
          <>
            <img
              src={src}
              alt={alt}
              onLoad={() => setLoaded(true)}
              className={clsx(
                styles.cropImage,
                loaded ? styles.fadeInVisible : styles.fadeIn,
              )}
              style={imageStyle}
            />
            {tempCrop && iconStates.crop === 'active' && activeSourceImage && (
              <div className={styles.cropMask} style={maskStyle}>
                <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
              </div>
            )}
          </>
        )}
        {loaded &&
          imageLayer &&
          iconStates.crop === 'active' &&
          tempCrop &&
          activeSourceImage && (
            <>
              {imageMeta && (
                <CropArea
                  cropLayer={tempCrop}
                  imageLayer={imageLayer}
                  orientation={sizeCard.orientation}
                  originalImage={activeSourceImage}
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
