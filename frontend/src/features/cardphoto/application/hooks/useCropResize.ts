import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { updateCrop, dispatchQualityUpdate, getQualityColor } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer, ImageMeta } from '../../domain/types'

export const useCropResize = (
  tempCrop: CropLayer,
  imageLayer: ImageLayer,
  setTempCrop: (c: CropLayer) => void,
  setLast: (c: CropLayer) => void,
  onChange: (c: CropLayer) => void,
  onCommit: (c: CropLayer) => void,
  begin: () => void,
  end: () => void,
  attach: (
    mouseMove: (e: MouseEvent) => void,
    mouseUp: (e: MouseEvent) => void,
    touchMove: (e: TouchEvent) => void,
    touchEnd: (e: TouchEvent) => void,
  ) => () => void,
  lastCropRef: React.MutableRefObject<CropLayer>,
  imageMeta: ImageMeta,
  orientation: LayoutOrientation,
) => {
  return (
    corner: 'TL' | 'TR' | 'BL' | 'BR',
    startX: number,
    startY: number,
  ) => {
    begin()

    const { minAllowedDpi, widthMm } = CARD_SCALE_CONFIG
    const inches = widthMm / 25.4

    const isSideOrientation =
      imageLayer.orientation === 90 || imageLayer.orientation === 270
    const originalRefWidth = isSideOrientation
      ? imageMeta.height
      : imageMeta.width
    const scale = originalRefWidth / Math.max(1, imageLayer.meta.width)

    const safeMinWidth = (minAllowedDpi * inches) / scale

    const startState = { ...tempCrop, meta: { ...tempCrop.meta } }

    const move = (clientX: number, clientY: number) => {
      const dx = clientX - startX
      const dy = clientY - startY

      const next = updateCrop(
        corner,
        dx,
        dy,
        startState,
        imageLayer,
        imageMeta,
        orientation,
        safeMinWidth,
      )

      dispatchQualityUpdate(next.meta.qualityProgress, next.meta.quality)
      const color = getQualityColor(next.meta.qualityProgress)
      document.documentElement.style.setProperty('--crop-handle-color', color)

      setTempCrop(next)
      setLast(next)
      onChange(next)
    }

    const finish = () => {
      end()
      onCommit(lastCropRef.current)
      if (detachRef) detachRef()
    }

    const mouseMove = (e: MouseEvent) => move(e.clientX, e.clientY)
    const mouseUp = () => finish()

    const touchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        move(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const touchEnd = () => finish()

    const detachRef = attach(mouseMove, mouseUp, touchMove, touchEnd)
  }
}
