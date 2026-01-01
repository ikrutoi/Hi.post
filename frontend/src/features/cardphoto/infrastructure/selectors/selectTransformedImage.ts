import { createSelector } from '@reduxjs/toolkit'
import { ImageMeta, ImageOperation } from '@cardphoto/domain/types'
import {
  selectOriginalImage,
  selectOperations,
  selectActiveIndex,
} from './index'

export function applyOperations(
  original: ImageMeta,
  operations: ImageOperation[]
): ImageMeta {
  let result = { ...original }

  for (const op of operations) {
    switch (op.type) {
      case 'initial':
        break
      case 'crop':
        if (op.payload.area) {
          result = {
            ...result,
            width: op.payload.area.width,
            height: op.payload.area.height,
          }
        }
        break
      case 'apply':
        if (op.payload.snapshot.crop) {
          result = {
            ...result,
            width: op.payload.snapshot.crop.width,
            height: op.payload.snapshot.crop.height,
          }
        }
        break
    }
  }

  return result
}

// export const selectTransformedImage = createSelector(
//   [selectOriginalImage, selectOperations, selectActiveIndex],
//   (original, operations, activeIndex) => {
//     if (!original) return null
//     const applied = operations.slice(0, activeIndex + 1)
//     return applyOperations(original as ImageMeta, applied)
//   }
// )
