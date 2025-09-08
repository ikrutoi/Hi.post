import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardphotoToolbarState } from '../../domain/cardphotoTypes'

const initialState: CardphotoToolbarState = {
  download: true,
  save: false,
  delete: false,
  turn: true,
  maximize: false,
  crop: true,
}

const cardphotoToolbarSlice = createSlice({
  name: 'cardphotoToolbar',
  initialState,
  reducers: {
    updateCardphotoToolbar: (
      state,
      action: PayloadAction<Partial<CardphotoToolbarState>>
    ) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { updateCardphotoToolbar } = cardphotoToolbarSlice.actions
export default cardphotoToolbarSlice.reducer
