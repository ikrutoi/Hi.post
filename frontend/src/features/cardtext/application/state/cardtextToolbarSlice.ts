import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CardtextToolbarState } from '../../domain/cardtextTypes'

const initialState: CardtextToolbarState = {
  italic: 'hover',
  fontSize: true,
  color: true,
  left: 'hover',
  center: true,
  right: true,
  justify: true,
  save: false,
  delete: false,
  clip: false,
}

const cardtextToolbarSlice = createSlice({
  name: 'cardtextToolbar',
  initialState,
  reducers: {
    updateCardtextToolbar: (
      state,
      action: PayloadAction<Partial<CardtextToolbarState>>
    ) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { updateCardtextToolbar } = cardtextToolbarSlice.actions
export default cardtextToolbarSlice.reducer
