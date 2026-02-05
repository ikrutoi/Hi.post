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

// export interface CardtextState {
//   value: CardtextValue
//   plainText: string
//   isComplete: boolean
//   cardtextLines: number
//   resetToken: number
//   fontSizeStep: number
// }

// const initialState: CardtextState = {
//   value: initialCardtextValue,
//   plainText: '',
//   isComplete: false,
//   cardtextLines: DEFAULT_CARDTEXT_LINES,
//   resetToken: 0,
//   fontSizeStep: 3,
// }

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
    color: '#000000',
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

    restoreCardtextSession(state, action: PayloadAction<CardtextStyle>) {
      state.style = action.payload
    },

    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')
      state.isComplete = state.plainText.trim().length > 0
    },

    // setFontSizeStep(state, action: PayloadAction<number>) {
    //   state.fontSizeStep = action.payload
    // },

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

    clear(state) {
      state.value = initialCardtextValue.map((b) => ({
        ...b,
        children: b.children.map((c) => ({ ...c })),
      }))
      state.plainText = ''
      state.isComplete = false
      state.resetToken += 1
    },

    // restoreFontSize(state, action: PayloadAction<number>) {
    //   state.fontSizeStep = action.payload
    // },

    restoreCardtext(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
    },
  },
})

export const {
  setValue,
  // setFontSizeStep,
  setAlign,
  setTextStyle,
  restoreCardtextSession,
  setPlainText,
  setComplete,
  setCardtextLines,
  initCardtext,
  clear,
  restoreCardtext,
  // restoreFontSize,
} = cardtextSlice.actions

export default cardtextSlice.reducer
