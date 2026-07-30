import React from 'react'
import { applyBounds } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer } from '../../domain/types'

export const useCropDrag = (
  cropLayer: CropLayer,
  imageLayer: ImageLayer,
  setLast: (c: CropLayer) => void,
  onPreviewChange: (c: CropLayer) => void,
  onCommit: (c: CropLayer) => void,
  begin: () => void,
  end: () => void,
  attach: any,
  lastCropRef: React.MutableRefObject<CropLayer>,
  orientation: LayoutOrientation,
) => {
  return (startX: number, startY: number) => {
    begin()

    const snapshot = { ...cropLayer, meta: { ...cropLayer.meta } }
    setLast(snapshot)

    let originX = startX
    let originY = startY
    const initialCropX = snapshot.x
    const initialCropY = snapshot.y

    let raf = 0
    let pending: CropLayer | null = null

    const flushPreview = () => {
      raf = 0
      if (!pending) return
      const next = pending
      pending = null
      onPreviewChange(next)
    }

    const move = (clientX: number, clientY: number) => {
      if (!imageLayer) return

      const dx = clientX - originX
      const dy = clientY - originY

      const next = applyBounds(
        { ...snapshot, x: initialCropX + dx, y: initialCropY + dy },
        imageLayer,
        orientation,
      )

      const realDx = next.x - initialCropX
      const realDy = next.y - initialCropY
      originX = clientX - realDx
      originY = clientY - realDy

      setLast(next)
      pending = next
      if (!raf) raf = requestAnimationFrame(flushPreview)
    }

    const finish = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      if (pending) {
        onPreviewChange(pending)
        pending = null
      }
      onCommit(lastCropRef.current)
      end()
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
