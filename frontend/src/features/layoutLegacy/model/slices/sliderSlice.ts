import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SliderState {
  sliderLetter: string | null
  sliderLine: string | null
  deltaEnd: number | null
}

const initialState: SliderState = {
  sliderLetter: null,
  sliderLine: null,
  deltaEnd: null,
}

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {
    setSliderLetter: (state, action: PayloadAction<string | null>) => {
      state.sliderLetter = action.payload
    },
    setSliderLine: (state, action: PayloadAction<string | null>) => {
      state.sliderLine = action.payload
    },
    setDeltaEnd: (state, action: PayloadAction<number | null>) => {
      state.deltaEnd = action.payload
    },
  },
})

export const { setSliderLetter, setSliderLine, setDeltaEnd } =
  sliderSlice.actions
export const sliderReducer = sliderSlice.reducer
export type { SliderState }
