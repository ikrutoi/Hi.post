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

export function useCardphotoCropFacade() {
  const dispatch = useAppDispatch()

  const crop = useAppSelector(selectCrop)
  const left = useAppSelector(selectCropLeft)
  const top = useAppSelector(selectCropTop)
  const width = useAppSelector(selectCropWidth)
  const height = useAppSelector(selectCropHeight)

  const reset = useCallback(
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

  const update = useCallback(
    (next: Partial<typeof crop>) => {
      dispatch(updateCrop(next))
    },
    [dispatch]
  )

  return {
    state: {
      crop,
      left,
      top,
      width,
      height,
    },
    actions: {
      reset,
      update,
    },
  }
}
