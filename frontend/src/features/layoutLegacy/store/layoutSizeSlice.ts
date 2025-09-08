import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SizeCard } from '@shared/layoutLegacy/model'

interface LayoutSizeState {
  sizeCard: SizeCard
  sizeMiniCard: SizeCard
  remSize: number | null
}

const initialState: LayoutSizeState = {
  sizeCard: { width: null, height: null },
  sizeMiniCard: { width: null, height: null },
  remSize: null,
}

const layoutSizeSlice = createSlice({
  name: 'layoutSize',
  initialState,
  reducers: {
    setSizeCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeCard = { ...state.sizeCard, ...action.payload }
    },
    setSizeMiniCard(state, action: PayloadAction<Partial<SizeCard>>) {
      state.sizeMiniCard = { ...state.sizeMiniCard, ...action.payload }
    },
    setRemSize(state, action: PayloadAction<number | null>) {
      state.remSize = action.payload
    },
  },
})

export const { setSizeCard, setSizeMiniCard, setRemSize } =
  layoutSizeSlice.actions
export default layoutSizeSlice.reducer
