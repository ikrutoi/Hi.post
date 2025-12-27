// src/cardphoto/application/controllers/useCardphotoCropController.ts
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { resetCrop, updateCrop } from '../../infrastructure/state'
import {
  selectCrop,
  selectCropLeft,
  selectCropTop,
  selectCropWidth,
  selectCropHeight,
} from '../../infrastructure/selectors'

export function useCardphotoCropController() {
  const dispatch = useAppDispatch()

  const crop = useAppSelector(selectCrop)
  const left = useAppSelector(selectCropLeft)
  const top = useAppSelector(selectCropTop)
  const width = useAppSelector(selectCropWidth)
  const height = useAppSelector(selectCropHeight)

  const doResetCrop = useCallback(
    (
      imageWidth: number,
      imageHeight: number,
      aspectRatio: number,
      imageLeft: number,
      imageTop: number
    ) => {
      dispatch(
        resetCrop({
          imageWidth,
          imageHeight,
          aspectRatio,
          imageLeft,
          imageTop,
        })
      )
    },
    [dispatch]
  )

  const doUpdateCrop = useCallback(
    (next: Partial<typeof crop>) => {
      dispatch(updateCrop(next))
    },
    [dispatch]
  )

  return {
    crop,
    left,
    top,
    width,
    height,
    resetCrop: doResetCrop,
    updateCrop: doUpdateCrop,
  }
}
