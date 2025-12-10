import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { type CardtextValue, initialCardtextValue } from '../../domain/types'
import {
  type CardtextToolbarState,
  initialCardtextToolbarState,
} from '@toolbar/domain/types'

interface CardtextState {
  value: CardtextValue
  toolbar: CardtextToolbarState
}

const initialState: CardtextState = {
  value: initialCardtextValue,
  toolbar: initialCardtextToolbarState,
}

export const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
    },
    updateToolbar(state, action: PayloadAction<Partial<CardtextToolbarState>>) {
      state.toolbar = { ...state.toolbar, ...action.payload }
    },
    reset(state) {
      state.value = initialCardtextValue
      state.toolbar = initialCardtextToolbarState
    },
  },
})

export const { setValue, updateToolbar, reset } = cardtextSlice.actions
export default cardtextSlice.reducer
