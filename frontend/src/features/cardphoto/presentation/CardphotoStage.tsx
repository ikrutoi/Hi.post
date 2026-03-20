import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  initCardphoto,
  uploadUserImage,
} from '../infrastructure/state'
import {
  selectActiveImage,
  selectCurrentConfig,
  selectActiveSource,
} from '../infrastructure/selectors'
import { CropArea } from './CropArea'
import { CropOverlay } from './CropOverlay'
import { useSizeFacade } from '@layout/application/facades'
import { useCardphotoUiFacade } from '../application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import {
  useImageUpload,
  useFileDialog,
  useCropState,
} from '../application/hooks'
import styles from './CardphotoStage.module.scss'
import { ImageMeta } from '../domain/types'
import { useAssetRegistryFacade } from '@entities/assetRegistry/application/facade/assetRegistryFacade'

/**
 * Единая сцена фото на открытке: скрытый выбор файла (toolbar `cardphotoAdd` / `download`),
 * отрисовка изображения по `currentConfig` и UI кропа.
 * Раньше компонент назывался `ImageCrop` — по смыслу это не только кроп.
 */
export const CardphotoStage = () => {
  const dispatch = useAppDispatch()
  const activeSource = useAppSelector(selectActiveSource)
  const activeImage = useAppSelector(selectActiveImage)
  const currentConfig = useAppSelector(selectCurrentConfig)

  const init = () => dispatch(initCardphoto())
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState
  const { getAssetById } = useAssetRegistryFacade()

  const { state: iconState } = useToolbarFacade('cardphoto')
  const cropToolbarState = iconState.crop?.state ?? 'disabled'

  const { sizeCard } = useSizeFacade()

  const [loaded, setLoaded] = useState(false)

  const containerKey = `${activeImage?.id}_${sizeCard.orientation}_${activeSource}`

  const [tempCrop, setTempCrop] = useCropState(
    cropToolbarState,
    currentConfig?.crop ?? null,
  )

  useEffect(() => {
    init()
  }, [])

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

  const asset = activeImage ? getAssetById(activeImage.id) : null
  const src = asset?.url || null
  const alt = activeImage?.id
  const imageLayer = currentConfig?.image ?? null

  const shouldShowImage = !!src && !!activeImage

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

  const maskStyle: React.CSSProperties | undefined =
    imageLayer && imageStyle
      ? {
          ...imageStyle,
          overflow: 'hidden',
        }
      : undefined

  const showCropUi = !!activeImage && !!imageLayer

  return (
    <div className={styles.cardphotoStage}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className={styles.imageInput}
        onChange={handleFileChange}
      />

      {showCropUi ? (
        <div
          key={containerKey}
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
              {tempCrop &&
                cropToolbarState === 'active' &&
                activeImage && (
                  <div className={styles.cropMask} style={maskStyle}>
                    <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
                  </div>
                )}
            </>
          )}
          {loaded &&
            imageLayer &&
            cropToolbarState === 'active' &&
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
                  />
                )}
              </>
            )}
        </div>
      ) : null}
    </div>
  )
}
