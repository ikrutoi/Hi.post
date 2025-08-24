import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Size = { width: number | null; height: number | null }

interface CardSizeState {
  sizeCard: Size
  sizeMiniCard: Size
  remSize: number | null
}

const initialState: CardSizeState = {
  sizeCard: { width: null, height: null },
  sizeMiniCard: { width: null, height: null },
  remSize: null,
}

const cardSizeSlice = createSlice({
  name: 'cardSize',
  initialState,
  reducers: {
    setSizeCard: (state, action: PayloadAction<Partial<Size>>) => {
      state.sizeCard = { ...state.sizeCard, ...action.payload }
    },
    setSizeMiniCard: (state, action: PayloadAction<Partial<Size>>) => {
      state.sizeMiniCard = { ...state.sizeMiniCard, ...action.payload }
    },
    setRemSize: (state, action: PayloadAction<number | null>) => {
      state.remSize = action.payload
    },
  },
})

export const { setSizeCard, setSizeMiniCard, setRemSize } =
  cardSizeSlice.actions
export const cardSizeReducer = cardSizeSlice.reducer
export type { CardSizeState }
