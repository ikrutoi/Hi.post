import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useStore } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { RootState } from '@app/state/store'
import {
  initCardphoto,
  uploadUserImage,
  commitWorkingConfig,
  setCardphotoImageStageRect,
} from '../infrastructure/state'
import {
  selectActiveImage,
  selectCardphotoAssetConfig,
  selectCardphotoAssetToolbar,
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
import {
  prepareForRedux,
  prepareConfigForRedux,
} from '@app/middleware/cardphotoHelpers'
import { bleedImageLayerToStage } from '../application/utils/imageFit'

function measureStagePx(el: HTMLDivElement): { width: number; height: number } {
  const { width, height } = el.getBoundingClientRect()
  return {
    width: Math.max(2, Math.ceil(width)),
    height: Math.max(2, Math.ceil(height)),
  }
}

export const CardphotoStage = () => {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const activeImage = useAppSelector(selectActiveImage)
  const assetConfig = useAppSelector(selectCardphotoAssetConfig)

  const init = () => dispatch(initCardphoto())
  /** Keep `full.blob` so the saga does not depend on fetch(blob:) (revoked / missing URLs). */
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))

  const { state: cardphotoUiState, actions: cardphotoUiActions } =
    useCardphotoUiFacade()
  const { shouldOpenFileDialog } = cardphotoUiState
  const { getAssetById } = useAssetRegistryFacade()

  const assetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  /** Stage crop UI follows the same derived toolbar section as the header. */
  const photoToolbarSection = assetToolbar ?? 'cardphotoCreate'
  const { state: iconState } = useToolbarFacade(photoToolbarSection)
  const cropToolbarState = iconState?.crop?.state ?? 'disabled'

  const { sizeCard } = useSizeFacade()

  const [loaded, setLoaded] = useState(false)
  const [stagePx, setStagePx] = useState<{ width: number; height: number } | null>(
    null,
  )
  const stageRef = useRef<HTMLDivElement>(null)

  const containerKey = `${activeImage?.id}_${sizeCard.orientation}_${activeImage?.status}_${activeImage?.source}`

  /** После любого commit конфига — реальные px стейджа (RO не срабатывает, если размер DOM не изменился). */
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el || !assetConfig) return
    const next = measureStagePx(el)
    setStagePx(next)
    dispatch(setCardphotoImageStageRect(next))
  }, [dispatch, assetConfig])

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return

    const publish = () => {
      const next = measureStagePx(el)
      // Не затираем rect при кратковременном нулевом размере: при `clearCurrentConfig`
      // в saga `showCropUi` на один кадр false → пустой стейдж → иначе в Redux уходит
      // null и fit идёт по глобальному sizeCard (картинка крупнее стейджа + зазор у бордера).
      if (next.width < 2 || next.height < 2) {
        return
      }
      setStagePx(next)
      dispatch(setCardphotoImageStageRect(next))
    }

    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)

    return () => {
      ro.disconnect()
      // Не сбрасываем rect: Strict Mode двойной mount обнулял бы rect → saga видела null → sizeCard.
    }
  }, [dispatch])

  const [tempCrop, setTempCrop] = useCropState(
    cropToolbarState,
    assetConfig?.crop ?? null,
  )

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!activeImage) setLoaded(false)
  }, [activeImage])

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

  const asset = getAssetById(activeImage?.id ?? null)
  const src = asset?.url || activeImage?.url || null
  const alt = activeImage?.id
  const imageLayer = assetConfig?.image ?? null

  const shouldShowImage = !!src && !!activeImage

  const renderedImageBox = useMemo(() => {
    if (!imageLayer) return null
    if (!stagePx) {
      return {
        left: imageLayer.left,
        top: imageLayer.top,
        width: imageLayer.meta.width,
        height: imageLayer.meta.height,
      }
    }
    return bleedImageLayerToStage(imageLayer, stagePx.width, stagePx.height)
  }, [imageLayer, stagePx])

  const imageStyle: React.CSSProperties | undefined = renderedImageBox
    ? {
        position: 'absolute',
        left: `${renderedImageBox.left}px`,
        top: `${renderedImageBox.top}px`,
        width: `${renderedImageBox.width}px`,
        height: `${renderedImageBox.height}px`,
        transform:
          imageLayer && imageLayer.rotation
            ? `rotate(${imageLayer.rotation}deg)`
            : undefined,
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

  const cropContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  }

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
          ref={stageRef}
          className={styles.cropContainer}
          style={cropContainerStyle}
        >
          <div className={styles.imageStack}>
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
                {tempCrop && cropToolbarState === 'active' && activeImage && (
                  <div className={styles.cropMask} style={maskStyle}>
                    <CropOverlay cropLayer={tempCrop} imageLayer={imageLayer} />
                  </div>
                )}
              </>
            )}
          </div>
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
                    onPreviewChange={(newCrop) => setTempCrop(newCrop)}
                    onCommit={(finalCrop) => {
                      setTempCrop(finalCrop)
                      const cfg = selectCardphotoAssetConfig(store.getState())
                      if (cfg) {
                        dispatch(
                          commitWorkingConfig(
                            prepareConfigForRedux({
                              ...cfg,
                              crop: finalCrop,
                            }),
                          ),
                        )
                      }
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
