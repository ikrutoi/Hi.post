import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EMPTY_PARAGRAPH } from '../../domain/types'
import type { CardtextState, CardtextValue } from '../../domain/types'

const initialState: CardtextState = {
  value: EMPTY_PARAGRAPH,
  plainText: '',
  isComplete: false,
}

const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((b) => b.children.map((c) => c.text).join(' '))
        .join('\n')
      state.isComplete = state.plainText.trim().length > 0
    },
    clear(state) {
      state.value = EMPTY_PARAGRAPH
      state.plainText = ''
      state.isComplete = false
    },
  },
})

export const { setValue, clear } = cardtextSlice.actions
export default cardtextSlice.reducer
