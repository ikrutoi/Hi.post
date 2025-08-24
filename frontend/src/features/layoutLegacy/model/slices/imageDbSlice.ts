import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ImageSet = {
  originalImage: string | null
  workingImage: string | null
  miniImage: string | null
}

interface ImageDbState {
  hiPostImages: ImageSet
  userImages: ImageSet
}

const initialState: ImageDbState = {
  hiPostImages: { originalImage: null, workingImage: null, miniImage: null },
  userImages: { originalImage: null, workingImage: null, miniImage: null },
}

const imageDbSlice = createSlice({
  name: 'imageDb',
  initialState,
  reducers: {
    setHiPostImages: (state, action: PayloadAction<Partial<ImageSet>>) => {
      state.hiPostImages = { ...state.hiPostImages, ...action.payload }
    },
    setUserImages: (state, action: PayloadAction<Partial<ImageSet>>) => {
      state.userImages = { ...state.userImages, ...action.payload }
    },
  },
})

export const { setHiPostImages, setUserImages } = imageDbSlice.actions
export const imageDbReducer = imageDbSlice.reducer
export type { ImageDbState }
