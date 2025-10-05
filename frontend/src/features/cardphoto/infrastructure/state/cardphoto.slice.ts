import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardphotoState } from '../../domain/types'

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
  },
})

export const { updateCardphoto } = cardphotoSlice.actions
export default cardphotoSlice.reducer
