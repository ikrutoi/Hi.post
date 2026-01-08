import { updateCrop } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer } from '../../domain/types'

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
    touchEnd: (e: TouchEvent) => void
  ) => () => void,
  lastCropRef: React.MutableRefObject<CropLayer>,
  orientation: LayoutOrientation
) => {
  return (
    corner: 'TL' | 'TR' | 'BL' | 'BR',
    startX: number,
    startY: number
  ) => {
    begin()
    const start = { ...tempCrop, meta: { ...tempCrop.meta } }

    const move = (clientX: number, clientY: number) => {
      const dx = clientX - startX
      const dy = clientY - startY
      const next = updateCrop(corner, dx, dy, start, imageLayer, orientation)

      console.log('useCropResize', next)
      setTempCrop(next)
      setLast(next)
      onChange(next)
    }

    const finish = () => {
      end()
      onCommit(lastCropRef.current)
      detach()
    }

    const mouseMove = (e: MouseEvent) => move(e.clientX, e.clientY)
    const mouseUp = () => finish()
    const touchMove = (e: TouchEvent) => {
      if (e.touches.length) move(e.touches[0].clientX, e.touches[0].clientY)
    }
    const touchEnd = () => finish()

    const detach = attach(mouseMove, mouseUp, touchMove, touchEnd)
  }
}
