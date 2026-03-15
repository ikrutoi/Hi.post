import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialCardtextState } from '../../domain/types'
import { initialCardtextValue } from '../../domain/editor/types'
import type {
  CardtextValue,
  CardtextStyle,
  CardtextBlock,
  CardtextTemplateContent,
} from '../../domain/editor/types'
import type { CardtextTemplate } from '../../domain/templates/types'

export type { CardtextTemplatesListState } from '../../domain/templates/types'

export const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState: initialCardtextState,
  reducers: {
    setValue(state, action: PayloadAction<CardtextValue>) {
      state.value = action.payload
      state.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')
      const hasText = state.plainText.trim().length > 0
      if (hasText) state.isComplete = false
      if (!hasText) state.assetId = null
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
      state.assetId = null
      state.resetToken += 1
    },

    setCardtextAssetId(state, action: PayloadAction<string | null>) {
      state.assetId = action.payload
    },

    restoreCardtextSession(
      state,
      action: PayloadAction<
        CardtextTemplateContent & { assetId?: string | null }
      >,
    ) {
      const {
        value,
        style,
        title,
        plainText,
        cardtextLines,
        favorite,
        assetId,
      } = action.payload
      if (value) state.value = value
      if (style) state.style = style
      if (title !== undefined) state.title = title
      if (plainText !== undefined) state.plainText = plainText
      if (cardtextLines !== undefined) state.cardtextLines = cardtextLines
      if (favorite !== undefined) state.favorite = favorite
      if (assetId !== undefined) state.assetId = assetId
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

    loadCardtextTemplatesRequest(state) {
      state.templatesListLoading = true
      // не обнуляем templatesList — бэдж listCardtext не моргает при обновлении
    },
    loadCardtextTemplatesSuccess(state, action: PayloadAction<CardtextTemplate[]>) {
      state.templatesList = action.payload
      state.templatesListLoading = false
    },
    loadCardtextTemplatesFailure(state) {
      state.templatesListLoading = false
      state.templatesList = []
    },

    /** Обновить только favorite у шаблона в списке (без перезапроса — строка не моргает) */
    updateCardtextTemplateFavoriteInList(
      state,
      action: PayloadAction<{ id: string; favorite: boolean }>,
    ) {
      const { id, favorite } = action.payload
      if (!Array.isArray(state.templatesList)) return
      const idx = state.templatesList.findIndex((t) => t.id === id)
      if (idx !== -1) state.templatesList[idx] = { ...state.templatesList[idx], favorite }
    },

    setCardtextShowViewMode(state, action: PayloadAction<boolean>) {
      state.showCardtextView = action.payload
      if (!action.payload) state.assetId = null
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
  setCardtextAssetId,
  restoreCardtextSession,
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  cardtextTemplateAdded,
  loadCardtextTemplatesRequest,
  loadCardtextTemplatesSuccess,
  loadCardtextTemplatesFailure,
  updateCardtextTemplateFavoriteInList,
  setCardtextShowViewMode,
  setCardtextFocusRequested,
} = cardtextSlice.actions

export default cardtextSlice.reducer
