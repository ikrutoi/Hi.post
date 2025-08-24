import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LayoutSliderState {
  sliderLetter: string | null
  sliderLine: string | null
  deltaEnd: number | null
}

const initialState: LayoutSliderState = {
  sliderLetter: null,
  sliderLine: null,
  deltaEnd: null,
}

const layoutSliderSlice = createSlice({
  name: 'layoutSlider',
  initialState,
  reducers: {
    setSliderLetter(state, action: PayloadAction<string | null>) {
      state.sliderLetter = action.payload
    },
    setSliderLine(state, action: PayloadAction<string | null>) {
      state.sliderLine = action.payload
    },
    setDeltaEnd(state, action: PayloadAction<number | null>) {
      state.deltaEnd = action.payload
    },
  },
})

export const { setSliderLetter, setSliderLine, setDeltaEnd } =
  layoutSliderSlice.actions
export default layoutSliderSlice.reducer
