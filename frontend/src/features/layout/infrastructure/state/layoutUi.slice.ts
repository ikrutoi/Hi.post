import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { LayoutUiState } from '../../domain/types'

const initialState: LayoutUiState = {
  miniAddressClose: null,
  navHistory: false,
  envelopeSave: null,
  envelopeSaveSecond: null,
  envelopeRemoveAddress: null,
  cardphotoClick: null,
  status: {
    cart: false,
  },
}

const layoutUiSlice = createSlice({
  name: 'layoutUi',
  initialState,
  reducers: {
    updateLayoutUi(state, action: PayloadAction<Partial<LayoutUiState>>) {
      Object.assign(state, action.payload)
    },
    resetLayoutUi() {
      return initialState
    },
  },
})

export const { updateLayoutUi, resetLayoutUi } = layoutUiSlice.actions
export default layoutUiSlice.reducer
