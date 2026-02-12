import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  EMPTY_PARAGRAPH,
  DEFAULT_CARDTEXT_LINES,
  initialCardtextValue,
} from '../../domain/types'
import type {
  CardtextValue,
  CardtextState,
  CardtextStyle,
  CardtextBlock,
  CardtextSessionRecord,
} from '../../domain/types'

const initialState: CardtextState = {
  value: [
    {
      type: 'paragraph',
      align: 'left',
      children: [{ text: '' }],
    },
  ],
  style: {
    fontFamily: 'Roboto',
    fontSizeStep: 3,
    color: 'blue',
    align: 'left',
  },
  plainText: '',
  isComplete: false,
  cardtextLines: 15,
  resetToken: 0,
}

export const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState,
  reducers: {
    setTextStyle(state, action: PayloadAction<Partial<CardtextStyle>>) {
      state.style = {
        ...state.style,
        ...action.payload,
      }
    },

    setAlign(state, action: PayloadAction<CardtextBlock['align']>) {
      state.value = state.value.map((block) => ({
        ...block,
        align: action.payload,
      }))
    },

    restoreCardtextSession(
      state,
      action: PayloadAction<CardtextSessionRecord>,
    ) {
      const { value, style, plainText, cardtextLines } = action.payload

      if (value) state.value = value
      if (style) state.style = style
      if (plainText !== undefined) state.plainText = plainText
      if (cardtextLines !== undefined) state.cardtextLines = cardtextLines

      state.isComplete = state.plainText.trim().length > 0
      state.resetToken += 1
    },

    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')
      state.isComplete = state.plainText.trim().length > 0
    },

    setFontSizeStep(state, action: PayloadAction<number>) {
      state.style.fontSizeStep = action.payload
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

    initCardtext(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')
      state.isComplete = state.plainText.trim().length > 0
    },

    clearText(state) {
      state.value = initialCardtextValue.map((b) => ({
        ...b,
        children: b.children.map((c) => ({ ...c })),
      }))
      state.plainText = ''
      state.isComplete = false
      state.resetToken += 1
    },

    restoreFontSize(state, action: PayloadAction<number>) {
      state.style.fontSizeStep = action.payload
    },

    restoreCardtext(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
    },
  },
})

export const {
  setValue,
  setFontSizeStep,
  setAlign,
  setTextStyle,
  restoreCardtextSession,
  setPlainText,
  setComplete,
  setCardtextLines,
  initCardtext,
  clearText,
  restoreCardtext,
  restoreFontSize,
} = cardtextSlice.actions

export default cardtextSlice.reducer
