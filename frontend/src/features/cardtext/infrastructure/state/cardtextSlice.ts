import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialCardtextValue } from '../../domain/types'
import type {
  CardtextValue,
  CardtextState,
  CardtextStyle,
  CardtextBlock,
  CardtextTemplateContent,
} from '../../domain/types'
import type { CardtextTemplate } from '@entities/templates/domain/types/cardtextTemplate.types'

interface CardtextUIState {
  isListPanelOpen: boolean
  isAddTemplateOpen: boolean
  showCardtextView: boolean
  requestCardtextFocus: boolean
}

export interface CardtextTemplatesListState {
  items: CardtextTemplate[]
  isLoading: boolean
}

const initialState: CardtextState &
  CardtextUIState & { templatesList: CardtextTemplatesListState } = {
  currentTemplateId: null,
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
  isAddTemplateOpen: false,
  showCardtextView: false,
  requestCardtextFocus: false,
  templatesList: {
    items: [],
    isLoading: false,
  },
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
      const hasText = state.plainText.trim().length > 0
      if (hasText) state.isComplete = false
      if (!hasText) state.currentTemplateId = null
    },

    setTextStyle(state, action: PayloadAction<Partial<CardtextStyle>>) {
      state.style = { ...state.style, ...action.payload }
    },

    setAlign(state, action: PayloadAction<CardtextBlock['align']>) {
      state.value = state.value.map((block: CardtextBlock) => ({
        ...block,
        align: action.payload,
      }))
      state.style.align = action.payload
      state.resetToken += 1
    },

    setFontSizeStep(state, action: PayloadAction<number>) {
      state.style.fontSizeStep = action.payload
    },

    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload
    },

    setComplete(state, action: PayloadAction<boolean>) {
      state.isComplete = action.payload
    },

    setFavorite(state, action: PayloadAction<boolean | null>) {
      state.favorite = action.payload
    },

    clearText(state) {
      state.value = initialCardtextValue.map((b) => ({
        ...b,
        children: b.children.map((c) => ({ ...c })),
      }))
      state.plainText = ''
      state.isComplete = false
      state.currentTemplateId = null
      state.resetToken += 1
    },

    setCurrentCardtextTemplateId(state, action: PayloadAction<string | null>) {
      state.currentTemplateId = action.payload
    },

    restoreCardtextSession(
      state,
      action: PayloadAction<
        CardtextTemplateContent & { templateId?: string | null }
      >,
    ) {
      const {
        value,
        style,
        title,
        plainText,
        cardtextLines,
        favorite,
        templateId,
      } = action.payload
      if (value) state.value = value
      if (style) state.style = style
      if (title !== undefined) state.title = title
      if (plainText !== undefined) state.plainText = plainText
      if (cardtextLines !== undefined) state.cardtextLines = cardtextLines
      if (favorite !== undefined) state.favorite = favorite
      if (templateId !== undefined) state.currentTemplateId = templateId
      state.isComplete = state.plainText.trim().length > 0
      state.resetToken += 1
    },

    // —— UI ——
    setCardtextListPanelOpen(state, action: PayloadAction<boolean>) {
      state.isListPanelOpen = action.payload
    },

    setCardtextAddTemplateOpen(state, action: PayloadAction<boolean>) {
      state.isAddTemplateOpen = action.payload
    },

    cardtextTemplateAdded() {},

    loadCardtextTemplatesRequest() {},
    setCardtextTemplatesListLoading(state, action: PayloadAction<boolean>) {
      state.templatesList.isLoading = action.payload
    },
    loadCardtextTemplatesSuccess(state, action: PayloadAction<CardtextTemplate[]>) {
      state.templatesList.items = action.payload
      state.templatesList.isLoading = false
    },
    loadCardtextTemplatesFailure(state) {
      state.templatesList.isLoading = false
    },

    setCardtextShowViewMode(state, action: PayloadAction<boolean>) {
      state.showCardtextView = action.payload
      if (!action.payload) state.currentTemplateId = null
    },

    setCardtextFocusRequested(state, action: PayloadAction<boolean>) {
      state.requestCardtextFocus = action.payload
    },
  },
})

export const {
  setValue,
  setTextStyle,
  setAlign,
  setFontSizeStep,
  setTitle,
  setComplete,
  setFavorite,
  clearText,
  setCurrentCardtextTemplateId,
  restoreCardtextSession,
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  cardtextTemplateAdded,
  loadCardtextTemplatesRequest,
  setCardtextTemplatesListLoading,
  loadCardtextTemplatesSuccess,
  loadCardtextTemplatesFailure,
  setCardtextShowViewMode,
  setCardtextFocusRequested,
} = cardtextSlice.actions

export default cardtextSlice.reducer
