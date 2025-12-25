import { createSelector } from '@reduxjs/toolkit'
import { ImageMeta, ImageOperation } from '@cardphoto/domain/types'
import {
  selectOriginalImage,
  selectOperations,
  selectActiveIndex,
} from './index'

function applyOperations(
  original: ImageMeta,
  operations: ImageOperation[]
): ImageMeta {
  let result = { ...original }

  for (const op of operations) {
    switch (op.type) {
      case 'initial':
        break
      case 'crop':
        result = {
          ...result,
          width: op.area.width,
          height: op.area.height,
        }
        break
      case 'rotate':
        result = {
          ...result,
          timestamp: Date.now(),
        }
        break
      case 'scale':
        result = {
          ...result,
          width: Math.round(result.width * op.factor),
          height: Math.round(result.height * op.factor),
        }
        break
    }
  }

  return result
}

export const selectTransformedImage = createSelector(
  [selectOriginalImage, selectOperations, selectActiveIndex],
  (original, operations, activeIndex) => {
    if (!original) return null
    const applied = operations.slice(0, activeIndex + 1)
    return applyOperations(original as ImageMeta, applied)
  }
)
