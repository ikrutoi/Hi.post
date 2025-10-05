import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardphotoState } from '../../domain/types'

const initialState: CardphotoState = {
  url: null,
  source: null,
  ui: {
    download: true,
    save: false,
    delete: false,
    turn: true,
    maximize: false,
    crop: true,
    click: null,
  },
}

const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    setCardphoto(
      state,
      action: PayloadAction<Partial<Omit<CardphotoState, 'ui'>>>
    ) {
      Object.assign(state, action.payload)
    },
    setCardphotoUi(
      state,
      action: PayloadAction<Partial<CardphotoState['ui']>>
    ) {
      state.ui = { ...state.ui, ...action.payload }
    },
  },
})

export const { setCardphoto, setCardphotoUi } = cardphotoSlice.actions
export default cardphotoSlice.reducer
