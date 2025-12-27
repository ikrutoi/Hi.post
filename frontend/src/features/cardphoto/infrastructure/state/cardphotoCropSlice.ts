import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { calculateInitialCrop } from '../../application/helpers'

export interface CropState {
  left: number
  top: number
  width: number
  height: number
}

const initialState: CropState = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
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
        imageLeft: number
        imageTop: number
      }>
    ) {
      const { imageWidth, imageHeight, aspectRatio, imageLeft, imageTop } =
        action.payload
      const crop = calculateInitialCrop(imageWidth, imageHeight, aspectRatio)

      crop.left += imageLeft
      crop.top += imageTop

      Object.assign(state, crop)
    },

    updateCrop(state, action: PayloadAction<Partial<CropState>>) {
      Object.assign(state, action.payload)
    },
  },
})

export const { resetCrop, updateCrop } = cardphotoCropSlice.actions
export default cardphotoCropSlice.reducer
