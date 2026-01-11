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

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState

  const { state: toolbarState } = useToolbarFacade('cardphoto')
  const { state: iconStates } = toolbarState

  const { size } = useLayoutFacade()
  const { sizeCard } = size

  const [loaded, setLoaded] = useState(false)

  const { src, alt } = useCardphotoSrc(cardphotoState.state)

  useEffect(() => {
    init()
  }, [])

  const { imageMeta, isReady, hasError } = useImageMetaLoader(src)

  const imageLayer = useImageLayer(
    imageMeta,
    sizeCard,
    cardphotoState.currentConfig?.image.orientation ?? 0
  )

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

  const shouldShowImage = !!src && isReady && imageMeta && !hasError

  const [tempCrop, setTempCrop] = useCropState(
    iconStates.crop,
    cardphotoState.currentConfig?.crop ?? null
  )

  if (!imageLayer) return

  const isRotated =
    imageLayer.orientation === 90 || imageLayer.orientation === 270

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${imageLayer.left}px`,
    top: `${imageLayer.top}px`,
    width: `${isRotated ? imageLayer.meta.height : imageLayer.meta.width}px`,
    height: `${isRotated ? imageLayer.meta.width : imageLayer.meta.height}px`,
    transform: `rotate(${imageLayer.orientation}deg)`,
    transformOrigin: 'center center',
    marginLeft: isRotated
      ? `${(imageLayer.meta.width - imageLayer.meta.height) / 2}px`
      : 0,
    marginTop: isRotated
      ? `${(imageLayer.meta.height - imageLayer.meta.width) / 2}px`
      : 0,
    maxWidth: 'none',
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

        {loaded && imageLayer && iconStates.crop === 'active' && (
          <>
            {tempCrop && (
              <>
                <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
                <CropArea
                  cropLayer={tempCrop}
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
          </>
        )}
      </div>
    </div>
  )
}
