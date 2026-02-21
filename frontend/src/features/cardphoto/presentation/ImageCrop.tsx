import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  initCardphoto,
  uploadUserImage,
  // addOperation,
} from '../infrastructure/state'
import {
  selectActiveImage,
  selectCurrentConfig,
  selectActiveSource,
} from '../infrastructure/selectors'
import { CropArea } from './CropArea'
import { CropOverlay } from './CropOverlay'
import { useSizeFacade } from '@layout/application/facades'
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
import { CardphotoOperation, ImageMeta, ImageSource } from '../domain/types'
import { useAssetRegistryFacade } from '@entities/assetRegistry/application/facade/assetRegistryFacade'

export const ImageCrop = () => {
  const dispatch = useAppDispatch()
  const activeSource = useAppSelector(selectActiveSource)
  const activeImage = useAppSelector(selectActiveImage)
  const currentConfig = useAppSelector(selectCurrentConfig)

  const init = () => dispatch(initCardphoto())
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState
  const { registry, getAssetById } = useAssetRegistryFacade()

  console.count('ImageCrop Render')
  // console.log('ImageCrop assetRegistry', registry)

  const { state: iconState } = useToolbarFacade('cardphoto')

  const { sizeCard } = useSizeFacade()

  const [loaded, setLoaded] = useState(false)

  const containerKey = `${activeImage?.id}_${sizeCard.orientation}_${activeSource}`

  const [tempCrop, setTempCrop] = useCropState(
    iconState.crop.state,
    currentConfig?.crop ?? null,
  )

  useEffect(() => {
    console.log('ImageCrop USE_EFFECT_init')
    init()
  }, [])

  if (!activeImage) return
  const asset = getAssetById(activeImage?.id)

  const src = asset?.url || null
  const alt = activeImage?.id

  const imageLayer = currentConfig?.image || null

  const { inputRef, trackCancel } = useFileDialog()

  useEffect(() => {
    if (shouldOpenFileDialog) {
      trackCancel()
      inputRef.current?.click()
      cardphotoUiActions.resetFileDialog()
    }
  }, [shouldOpenFileDialog, cardphotoUiActions, trackCancel])

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

  // console.log('ImageCrop +++++5')

  return (
    <div
      className={styles.imageCrop}
      // style={{ width: `${sizeCard.width}px`, height: `${sizeCard.height}px` }}
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
              key={src}
              src={src}
              alt={alt}
              onLoad={() => setLoaded(true)}
              className={clsx(
                styles.cropImage,
                loaded ? styles.fadeInVisible : styles.fadeIn,
              )}
              style={imageStyle}
            />
            {tempCrop && iconState.crop.state === 'active' && activeImage && (
              <div className={styles.cropMask} style={maskStyle}>
                <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
              </div>
            )}
          </>
        )}
        {loaded &&
          imageLayer &&
          iconState.crop.state === 'active' &&
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
                  // onCommit={(finalCrop) => {
                  //   addOp({
                  //     type: 'operation',
                  //     payload: {
                  //       config: {
                  //         ...currentConfig!,
                  //         crop: finalCrop,
                  //       },
                  //     },
                  //   })
                  // }}
                />
              )}
            </>
          )}
      </div>
    </div>
  )
}
