import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SizeState, SizeCard } from '../../domain/types'

const initialState: SizeState = {
  sizeCard: { width: 0, height: 0 },
  sizeMiniCard: { width: 0, height: 0 },
  remSize: null,
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
  },
})

export const { setSizeCard, setSizeMiniCard, setRemSize } = sizeSlice.actions
export default sizeSlice.reducer
