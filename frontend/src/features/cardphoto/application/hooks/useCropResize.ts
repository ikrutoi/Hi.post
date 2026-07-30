import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { updateCrop, dispatchQualityUpdate, getQualityColor } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer, ImageMeta } from '../../domain/types'

export const useCropResize = (
  cropLayer: CropLayer,
  imageLayer: ImageLayer,
  setLast: (c: CropLayer) => void,
  onPreviewChange: (c: CropLayer) => void,
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
      imageLayer.rotation === 90 || imageLayer.rotation === 270
    const originalRefWidth = isSideOrientation
      ? imageMeta.height
      : imageMeta.width
    const scale = originalRefWidth / Math.max(1, imageLayer.meta.width)

    const safeMinWidth = (minAllowedDpi * inches) / scale

    const startState = { ...cropLayer, meta: { ...cropLayer.meta } }
    setLast(startState)

    let raf = 0
    let pending: CropLayer | null = null

    const flushPreview = () => {
      raf = 0
      if (!pending) return
      const next = pending
      pending = null
      const p = Math.max(
        0,
        Math.min(100, Number(next.meta.qualityProgress) || 0),
      )
      dispatchQualityUpdate(p)
      document.documentElement.style.setProperty(
        '--crop-handle-color',
        getQualityColor(p),
      )
      onPreviewChange(next)
    }

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

      setLast(next)
      pending = next
      if (!raf) raf = requestAnimationFrame(flushPreview)
    }

    const finish = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      if (pending) {
        const next = pending
        pending = null
        const p = Math.max(
          0,
          Math.min(100, Number(next.meta.qualityProgress) || 0),
        )
        dispatchQualityUpdate(p)
        document.documentElement.style.setProperty(
          '--crop-handle-color',
          getQualityColor(p),
        )
        onPreviewChange(next)
      }
      onCommit(lastCropRef.current)
      end()
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
