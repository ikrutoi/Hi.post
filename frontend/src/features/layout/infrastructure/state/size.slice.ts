import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SizeState, SizeCard } from '../../domain/types'

const initialState: SizeState = {
  sizeCard: { width: 0, height: 0 },
  sizeMiniCard: { width: 0, height: 0 },
  remSize: null,
  viewportSize: { width: 0, height: 0, viewportSize: null },
  scale: null,
}

export const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    setSizeCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeCard = {
        ...state.sizeCard,
        ...action.payload,
      }
    },
    setSizeMiniCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeMiniCard = {
        ...state.sizeMiniCard,
        ...action.payload,
      }
    },
    setRemSize(state, action: PayloadAction<number | null>) {
      state.remSize = action.payload
    },
    setScale(state, action: PayloadAction<number | null>) {
      state.scale = action.payload
    },
    setViewportSize(state, action: PayloadAction<Partial<SizeCard>>) {
      state.viewportSize = {
        ...state.viewportSize,
        ...action.payload,
      }
    },
  },
})

export const {
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
  setScale,
  setViewportSize,
} = sizeSlice.actions
export default sizeSlice.reducer
