import React from 'react'
import { clampDragWithinImage, applyBounds } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer } from '../../domain/types'

export const useCropDrag = (
  tempCrop: CropLayer,
  imageLayer: ImageLayer,
  setTempCrop: (c: CropLayer) => void,
  setLast: (c: CropLayer) => void,
  onChange: (c: CropLayer) => void,
  onCommit: (c: CropLayer) => void,
  begin: () => void,
  end: () => void,
  attach: any,
  lastCropRef: React.MutableRefObject<CropLayer>,
  orientation: LayoutOrientation,
) => {
  return (startX: number, startY: number) => {
    begin()

    const initialCropX = tempCrop.x
    const initialCropY = tempCrop.y

    const move = (clientX: number, clientY: number) => {
      if (!imageLayer) return

      const dx = clientX - startX
      const dy = clientY - startY

      const targetX = initialCropX + dx
      const targetY = initialCropY + dy

      const next = applyBounds(
        { ...tempCrop, x: targetX, y: targetY },
        imageLayer,
        orientation,
      )

      // getQualityProgress(next)

      const realDx = next.x - initialCropX
      const realDy = next.y - initialCropY

      startX = clientX - realDx
      startY = clientY - realDy

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

// export const useCropDrag1 = (
//   tempCrop: CropLayer,
//   imageLayer: ImageLayer,
//   setTempCrop: (c: CropLayer) => void,
//   setLast: (c: CropLayer) => void,
//   onChange: (c: CropLayer) => void,
//   onCommit: (c: CropLayer) => void,
//   begin: () => void,
//   end: () => void,
//   attach: (
//     mouseMove: (e: MouseEvent) => void,
//     mouseUp: (e: MouseEvent) => void,
//     touchMove: (e: TouchEvent) => void,
//     touchEnd: (e: TouchEvent) => void
//   ) => () => void,
//   lastCropRef: React.MutableRefObject<CropLayer>,
//   orientation: LayoutOrientation
// ) => {
//   return (startX: number, startY: number) => {
//     begin()
//     const start = { ...tempCrop, meta: { ...tempCrop.meta } }

//     const move = (clientX: number, clientY: number) => {
//       if (!imageLayer) return
//       const dx = clientX - startX
//       const dy = clientY - startY
//       const { x, y } = clampDragWithinImage(start, dx, dy, imageLayer)
//       const next = applyBounds({ ...start, x, y }, imageLayer, orientation)
//       setTempCrop(next)
//       setLast(next)
//       onChange(next)
//     }

//     const finish = () => {
//       end()
//       onCommit(lastCropRef.current)
//       detach()
//     }

//     const mouseMove = (e: MouseEvent) => move(e.clientX, e.clientY)
//     const mouseUp = () => finish()
//     const touchMove = (e: TouchEvent) => {
//       if (e.touches.length) move(e.touches[0].clientX, e.touches[0].clientY)
//     }
//     const touchEnd = () => finish()

//     const detach = attach(mouseMove, mouseUp, touchMove, touchEnd)
//   }
// }
