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
import {
  useImageUpload,
  useFileDialog,
  useCropState,
} from '../application/hooks'
import styles from './ImageCrop.module.scss'

export const ImageCrop = () => {
  const { state: cardphotoState, actions: cardphotoActions } =
    useCardphotoFacade()
  const { activeSource, activeImage } = cardphotoState
  const { init, setUserImage, addOp, uploadImage } = cardphotoActions

  const reduxCrop = cardphotoState.currentConfig?.crop

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState

  // console.log('ImageCrop state', cardphotoState)

  const { state: toolbarState } = useToolbarFacade('cardphoto')
  const { state: iconStates } = toolbarState

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)

  // const imageMeta = useCurrentImageMeta(cardphotoState.state)
  // console.log('ImageCrop1111 imageMeta', imageMeta)
  const containerKey = `${activeImage?.id}_${sizeCard.orientation}_${activeSource}`

  const [tempCrop, setTempCrop] = useCropState(
    iconStates.crop.state,
    cardphotoState.currentConfig?.crop ?? null,
  )

  useEffect(() => {
    init()
  }, [])

  const src = activeImage?.url
  const alt = activeImage?.id

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

  const shouldShowImage = !!src && activeImage

  const imageStyle: React.CSSProperties | undefined = imageLayer
    ? {
        position: 'absolute',
        left: `${imageLayer.left}px`,
        top: `${imageLayer.top}px`,
        width: `${imageLayer.meta.width}px`,
        height: `${imageLayer.meta.height}px`,
        transform: `rotate(${imageLayer.rotation}deg)`,
        transformOrigin: 'center center',
        maxWidth: 'none',
      }
    : undefined

  if (!imageLayer) return

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
        key={containerKey}
        // key={src}
        className={styles.cropContainer}
        style={{
          width: `${sizeCard.width}px`,
          height: `${sizeCard.height}px`,
        }}
      >
        {shouldShowImage && imageLayer && src && (
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
            {tempCrop && iconStates.crop.state === 'active' && activeImage && (
              <div className={styles.cropMask} style={maskStyle}>
                <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
              </div>
            )}
          </>
        )}
        {loaded &&
          imageLayer &&
          iconStates.crop.state === 'active' &&
          tempCrop &&
          activeImage && (
            <>
              {activeImage && (
                <CropArea
                  cropLayer={tempCrop}
                  imageLayer={imageLayer}
                  orientation={sizeCard.orientation}
                  originalImage={activeImage}
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
