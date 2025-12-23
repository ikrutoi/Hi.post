import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardphotoState } from '@entities/cardphoto/domain/types'

const initialState: CardphotoState = {
  url: null,
  source: null,
}

const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    updateCardphoto: (
      state,
      action: PayloadAction<Partial<CardphotoState>>
    ) => {
      Object.assign(state, action.payload)
    },
    resetCardphoto: (state) => {
      state.url = null
      state.source = null
    },
  },
})

export const { updateCardphoto, resetCardphoto } = cardphotoSlice.actions
export default cardphotoSlice.reducer
