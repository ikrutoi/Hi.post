import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Descendant } from 'slate'
import {
  EMPTY_PARAGRAPH,
  DEFAULT_CARDTEXT_LINES,
  initialCardtextValue,
} from '../../domain/types'
import type { CardtextValue } from '../../domain/types'

export interface CardtextState {
  value: CardtextValue
  plainText: string
  isComplete: boolean
  cardtextLines: number
}

const initialState: CardtextState = {
  value: initialCardtextValue,
  plainText: '',
  isComplete: false,
  cardtextLines: DEFAULT_CARDTEXT_LINES,
}

export const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')
      state.isComplete = state.plainText.trim().length > 0
    },
    setPlainText(state, action: PayloadAction<string>) {
      state.plainText = action.payload
    },
    setComplete(state, action: PayloadAction<boolean>) {
      state.isComplete = action.payload
    },
    setCardtextLines(state, action: PayloadAction<number>) {
      state.cardtextLines = action.payload
    },
    clear(state) {
      state.value = EMPTY_PARAGRAPH
      state.plainText = ''
      state.isComplete = false
      state.cardtextLines = DEFAULT_CARDTEXT_LINES
    },
  },
})

export const { setValue, setPlainText, setComplete, setCardtextLines, clear } =
  cardtextSlice.actions

export default cardtextSlice.reducer
