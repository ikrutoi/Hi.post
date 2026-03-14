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

const initialState: CardtextState & {
  isListPanelOpen?: boolean
  isSaveTemplateModalOpen?: boolean
  cardtextTemplatesInvalidated?: boolean
  showCardtextView?: boolean
  requestCardtextFocus?: boolean
} = {
  assetId: null,
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
    color: 'deepBlack',
    align: 'left',
  },
  title: '',
  plainText: '',
  applied: null,
  favorite: null,
  isComplete: false,
  cardtextLines: 15,
  resetToken: 0,
  isListPanelOpen: false,
  isSaveTemplateModalOpen: false,
  cardtextTemplatesInvalidated: false,
  showCardtextView: false,
  requestCardtextFocus: false,
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

    setAssetId(state, action: PayloadAction<string | null>) {
      state.assetId = action.payload
    },

    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')

      const hasText = state.plainText.trim().length > 0
      if (hasText) {
        state.isComplete = false
      }
      if (!hasText) state.assetId = null
    },

    setAlign(state, action: PayloadAction<CardtextBlock['align']>) {
      state.value = state.value.map((block) => ({
        ...block,
        align: action.payload,
      }))
      state.style.align = action.payload
      state.resetToken += 1
    },

    restoreCardtextSession(
      state,
      action: PayloadAction<CardtextSessionRecord>,
    ) {
      const { value, style, title, plainText, cardtextLines } = action.payload

      if (value) state.value = value
      if (style) state.style = style
      if (title !== undefined) state.title = title
      if (plainText !== undefined) state.plainText = plainText
      if (cardtextLines !== undefined) state.cardtextLines = cardtextLines

      state.isComplete = state.plainText.trim().length > 0
      state.resetToken += 1
    },

    // setValue(state, action: PayloadAction<CardtextValue>) {
    //   state.value = action.payload
    //   state.plainText = action.payload
    //     .map((block) => block.children.map((child) => child.text).join(' '))
    //     .join('\n')
    //   state.isComplete = state.plainText.trim().length > 0
    // },

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

    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload
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
      state.assetId = null
      state.resetToken += 1
    },

    restoreFontSize(state, action: PayloadAction<number>) {
      state.style.fontSizeStep = action.payload
    },

    restoreCardtext(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
    },

    setCardtextListPanelOpen(state, action: PayloadAction<boolean>) {
      // ignore type extension, runtime state carries UI flag
      ;(state as any).isListPanelOpen = action.payload
    },

    setCardtextSaveTemplateModalOpen(state, action: PayloadAction<boolean>) {
      ;(state as any).isSaveTemplateModalOpen = action.payload
    },

    setCardtextTemplatesInvalidated(state, action: PayloadAction<boolean>) {
      ;(state as any).cardtextTemplatesInvalidated = action.payload
    },

    setCardtextShowViewMode(state, action: PayloadAction<boolean>) {
      ;(state as any).showCardtextView = action.payload
    },

    setCardtextFocusRequested(state, action: PayloadAction<boolean>) {
      ;(state as any).requestCardtextFocus = action.payload
    },
  },
})

export const {
  setValue,
  setAssetId,
  setFontSizeStep,
  setAlign,
  setTextStyle,
  restoreCardtextSession,
  setPlainText,
  setComplete,
  setCardtextLines,
  setTitle,
  initCardtext,
  clearText,
  restoreCardtext,
  restoreFontSize,
  setCardtextListPanelOpen,
  setCardtextSaveTemplateModalOpen,
  setCardtextTemplatesInvalidated,
  setCardtextShowViewMode,
  setCardtextFocusRequested,
} = cardtextSlice.actions

export default cardtextSlice.reducer
