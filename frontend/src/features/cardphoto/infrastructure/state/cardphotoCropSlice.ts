import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  calculateInitialCrop,
  calculateCropPosition,
} from '../../application/helpers'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { ImageData, CropState } from '../../domain/types'

const aspectRatio = CARD_SCALE_CONFIG.aspectRatio

const initialState: CropState = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  aspectRatio: aspectRatio,
  imageAspectRatio: 0,
  ownerImageId: null,
}

export const cardphotoCropSlice = createSlice({
  name: 'cardphotoCrop',
  initialState,
  reducers: {
    resetCrop(
      state,
      action: PayloadAction<{
        imageWidth: number
        imageHeight: number
        aspectRatio: number
        imageAspectRatio: number
        imageLeft: number
        imageTop: number
        imageId: string
      }>
    ) {
      const {
        imageWidth,
        imageHeight,
        aspectRatio,
        imageAspectRatio,
        imageLeft,
        imageTop,
        imageId,
      } = action.payload

      console.log('reset', imageWidth, imageHeight)

      // const imageAspectRatio =
      //   imageWidth && imageHeight
      //     ? Number((imageWidth / imageHeight).toFixed(2))
      //     : CARD_SCALE_CONFIG.aspectRatio

      const cropSize = calculateInitialCrop(
        imageWidth,
        imageHeight,
        aspectRatio,
        imageAspectRatio
      )
      const cropPosition = calculateCropPosition(
        cropSize.left,
        cropSize.top,
        aspectRatio,
        imageAspectRatio,
        imageLeft,
        imageTop
      )

      const crop = {
        width: cropSize.width,
        height: cropSize.height,
        aspectRatio,
        imageAspectRatio,
        left: cropPosition?.left,
        top: cropPosition?.top,
      }

      Object.assign(state, crop)
      state.ownerImageId = imageId
    },

    updateCrop(state, action: PayloadAction<Partial<ImageData>>) {
      Object.assign(state, action.payload)
    },

    clearCrop(state) {
      state.left = 0
      state.top = 0
      state.width = 0
      state.height = 0
      state.ownerImageId = null
    },
  },
})

export const { resetCrop, updateCrop, clearCrop } = cardphotoCropSlice.actions
export default cardphotoCropSlice.reducer
