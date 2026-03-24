import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  selectActiveSource,
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

export const CardphotoStage = () => {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const activeSource = useAppSelector(selectActiveSource)
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
  const stageRef = useRef<HTMLDivElement>(null)

  const containerKey = `${activeImage?.id}_${sizeCard.orientation}_${activeSource}`

  /** После любого commit конфига — реальные px стейджа (RO не срабатывает, если размер DOM не изменился). */
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el || !assetConfig) return
    const w = el.clientWidth
    const h = el.clientHeight
    if (w < 2 || h < 2) return
    dispatch(setCardphotoImageStageRect({ width: w, height: h }))
  }, [dispatch, assetConfig])

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return

    const publish = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      // Не затираем rect при кратковременном нулевом размере: при `clearCurrentConfig`
      // в saga `showCropUi` на один кадр false → пустой стейдж → иначе в Redux уходит
      // null и fit идёт по глобальному sizeCard (картинка крупнее стейджа + зазор у бордера).
      if (w < 2 || h < 2) {
        return
      }
      dispatch(setCardphotoImageStageRect({ width: w, height: h }))
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
    <div ref={stageRef} className={styles.cardphotoStage}>
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
          // style={{
          //   width: `${sizeCard?.width ?? 0}px`,
          //   height: `${sizeCard?.height ?? 0}px`,
          // }}
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
              {tempCrop && cropToolbarState === 'active' && activeImage && (
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
