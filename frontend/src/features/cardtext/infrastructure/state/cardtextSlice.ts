import { createSlice, PayloadAction, type WritableDraft } from '@reduxjs/toolkit'
import {
  initialCardtextEditorState,
  initialCardtextValue,
  createInitialCardtextContent,
  type CardtextState,
  type CardtextValue,
  type CardtextStyle,
  type CardtextBlock,
  type CardtextContent,
  type CardtextStatus,
  type CardtextCreateDraft,
  type CardtextEditorSessionSnapshot,
  CardtextListSortDirection,
  CardtextTemplatesListState,
} from '../../domain/editor/editor.types'
import { isEmptyCardtextValue } from '@cardtext/domain/helpers/isEmptyCardtextValue'
import { isCardtextDraftContentEmpty } from '@cardtext/domain/helpers/isCardtextDraftContentEmpty'

export interface CardtextTemplatesUIState {
  isListPanelOpen: boolean
  isAddTemplateOpen: boolean
  isEditTitleOpen: boolean
  cardtextListSortDirection: CardtextListSortDirection
  templatesListLoading: boolean
}

export interface CardtextSliceState
  extends CardtextState, CardtextTemplatesUIState {
  templatesList: CardtextTemplatesListState
}

const initialCardtextTemplatesState: Pick<
  CardtextSliceState,
  keyof CardtextTemplatesUIState | 'templatesList'
> = {
  isListPanelOpen: false,
  isAddTemplateOpen: false,
  isEditTitleOpen: false,
  cardtextListSortDirection: 'asc',
  templatesListLoading: false,
  templatesList: null,
}

export const initialCardtextState: CardtextSliceState = {
  ...initialCardtextEditorState,
  ...initialCardtextTemplatesState,
}

function ensureAsset(
  state: WritableDraft<CardtextSliceState>,
): WritableDraft<CardtextContent> {
  if (state.assetData === null) {
    state.assetData = createInitialCardtextContent()
  }
  return state.assetData as WritableDraft<CardtextContent>
}

function cloneCardtextBranch(c: CardtextContent): CardtextContent {
  return {
    ...c,
    value: c.value.map((b) => ({
      ...b,
      children: b.children.map((ch) => ({ ...ch })),
    })),
    style: { ...c.style },
  }
}

export const cardtextSlice = createSlice({
  name: 'cardtext',
  initialState: initialCardtextState,
  reducers: {
    setValue(state, action: PayloadAction<CardtextValue>) {
      const ad = ensureAsset(state)
      ad.value = action.payload
      ad.plainText = action.payload
        .map((block) => block.children.map((child) => child.text).join(' '))
        .join('\n')
      const hasText = ad.plainText.trim().length > 0
      if (!hasText) ad.id = null
      if (ad.status === 'processed') ad.status = 'draft'
    },

    setTextStyle(state, action: PayloadAction<Partial<CardtextStyle>>) {
      const ad = ensureAsset(state)
      ad.style = { ...ad.style, ...action.payload }
      if (ad.status === 'processed') ad.status = 'draft'
    },

    setAlign(state, action: PayloadAction<CardtextBlock['align']>) {
      const ad = ensureAsset(state)
      ad.value = ad.value.map((block: CardtextBlock) => ({
        ...block,
        align: action.payload,
      }))
      ad.style.align = action.payload
      state.resetToken += 1
      if (ad.status === 'processed') ad.status = 'draft'
    },

    setFontSizeStep(state, action: PayloadAction<number>) {
      const ad = ensureAsset(state)
      ad.style.fontSizeStep = action.payload
      if (ad.status === 'processed') ad.status = 'draft'
    },

    setTitle(state, action: PayloadAction<string>) {
      ensureAsset(state).title = action.payload
    },

    setStatus(state, action: PayloadAction<CardtextStatus>) {
      if (state.assetData === null) return
      state.assetData.status = action.payload
    },

    setFavorite(state, action: PayloadAction<boolean | null>) {
      ensureAsset(state).favorite = action.payload
    },

    clearText(state) {
      state.assetData = null
      state.appliedData = null
      state.isDraftEngaged = false
      state.isCardtextViewEditMode = false
      state.resetToken += 1
    },

    /**
     * No active asset session (`assetData === null`). Editor shows defaults from selectors;
     * `appliedData` unchanged. Next edit dispatches use `ensureAsset` to materialize content.
     * `presetData` is not touched — it tracks the last template picked from the list until
     * the user replaces it or session restore overwrites it.
     */
    resetCardtextAssetToEmptyDraft(state) {
      state.assetData = null
      state.isDraftEngaged = false
      state.isCardtextViewEditMode = false
      if (isCardtextDraftContentEmpty(state.draftData)) {
        state.draftData = null
      }
      state.resetToken += 1
    },

    setCardtextId(state, action: PayloadAction<string | null>) {
      ensureAsset(state).id = action.payload
    },

    setCardtextPresetData(
      state,
      action: PayloadAction<CardtextContent | null>,
    ) {
      state.presetData = action.payload
    },

    setCardtextAppliedData(
      state,
      action: PayloadAction<CardtextContent | null>,
    ) {
      state.appliedData = action.payload
    },

    setDraftData(state, action: PayloadAction<CardtextContent | null>) {
      const p = action.payload
      state.draftData =
        p == null || isCardtextDraftContentEmpty(p) ? null : p
    },

    clearDraftData(state) {
      state.draftData = null
    },

    restoreDraftData(state, action: PayloadAction<CardtextContent>) {
      const { value, style, plainText, cardtextLines, timestamp, title, favorite } =
        action.payload
      const ad = ensureAsset(state)
      ad.value = value
      ad.style = style
      ad.plainText = plainText
      ad.cardtextLines = cardtextLines
      ad.timestamp = timestamp
      ad.title = title ?? ''
      ad.favorite = favorite ?? null
      ad.id = null
      ad.status = 'draft'
      state.resetToken += 1
      state.isDraftEngaged = false
      state.isCardtextViewEditMode = false
    },

    restoreCardtextEditorSession(
      state,
      action: PayloadAction<CardtextEditorSessionSnapshot>,
    ) {
      const {
        assetData,
        presetData,
        appliedData,
        draftData,
        isCardtextViewEditMode,
      } = action.payload
      state.assetData =
        assetData == null ? null : cloneCardtextBranch(assetData)
      state.presetData =
        presetData == null ? null : cloneCardtextBranch(presetData)
      state.appliedData =
        appliedData == null ? null : cloneCardtextBranch(appliedData)
      state.draftData =
        draftData == null || isCardtextDraftContentEmpty(draftData)
          ? null
          : cloneCardtextBranch(draftData)
      state.isDraftEngaged = false
      state.isCardtextViewEditMode = isCardtextViewEditMode ?? false
      state.resetToken += 1
    },

    restoreCardtextSession(
      state,
      action: PayloadAction<
        Partial<CardtextContent> & {
          /** @deprecated старые сессии */
          assetId?: string | null
          isComplete?: boolean
          applied?: string | null
          appliedData?: { value: CardtextValue; style: CardtextStyle } | null
          assetData?: { value: CardtextValue; style: CardtextStyle } | null
        }
      >,
    ) {
      const p = action.payload as Partial<CardtextContent> & {
        assetId?: string | null
        isComplete?: boolean
        applied?: string | null
        appliedData?: { value: CardtextValue; style: CardtextStyle } | null
        assetData?: { value: CardtextValue; style: CardtextStyle } | null
      }
      const {
        value,
        style,
        title,
        plainText,
        cardtextLines,
        favorite,
        timestamp,
        id,
      } = p
      const legacyAssetId = p.assetId
      const legacyApplied = p.applied
      const legacyAppliedData = p.appliedData
      const legacyAssetData = p.assetData
      const legacyComplete = p.isComplete

      const ad = ensureAsset(state)

      if (value !== undefined && value !== null) ad.value = value
      if (style !== undefined && style !== null) ad.style = style

      if (isEmptyCardtextValue(ad.value) && legacyAppliedData?.value) {
        ad.value = legacyAppliedData.value
        ad.style = { ...ad.style, ...legacyAppliedData.style }
      } else if (isEmptyCardtextValue(ad.value) && legacyAssetData?.value) {
        ad.value = legacyAssetData.value
        ad.style = { ...ad.style, ...legacyAssetData.style }
      }

      if (title !== undefined) ad.title = title
      if (plainText !== undefined) ad.plainText = plainText
      if (cardtextLines !== undefined) ad.cardtextLines = cardtextLines
      if (favorite !== undefined) ad.favorite = favorite
      if (timestamp !== undefined) ad.timestamp = timestamp
      if (id !== undefined) ad.id = id
      else if (legacyAssetId !== undefined) ad.id = legacyAssetId

      const derivedProcessed =
        legacyComplete === true ||
        (legacyApplied != null && legacyApplied !== '')

      const legacyAssetStatus = (p as { assetStatus?: CardtextStatus })
        .assetStatus
      if ('status' in p && p.status !== undefined) {
        ad.status = p.status
      } else if (legacyAssetStatus !== undefined) {
        ad.status = legacyAssetStatus
      } else if (derivedProcessed) {
        ad.status = 'processed'
      } else {
        ad.status = 'inLine'
      }

      if (ad.plainText.trim() === '' && ad.value?.length > 0) {
        ad.plainText = ad.value
          .map((block: CardtextBlock) =>
            block.children
              .map((ch: { text?: string }) => ch?.text ?? '')
              .join(' '),
          )
          .join('\n')
      }
      state.isDraftEngaged = false
      state.isCardtextViewEditMode = false
      state.resetToken += 1
    },

    // —— UI ——
    setCardtextListPanelOpen(state, action: PayloadAction<boolean>) {
      state.isListPanelOpen = action.payload
    },

    setCardtextAddTemplateOpen(state, action: PayloadAction<boolean>) {
      state.isAddTemplateOpen = action.payload
    },

    setCardtextEditTitleOpen(state, action: PayloadAction<boolean>) {
      state.isEditTitleOpen = action.payload
    },

    toggleCardtextListSortDirection(state) {
      state.cardtextListSortDirection =
        state.cardtextListSortDirection === 'asc' ? 'desc' : 'asc'
    },

    cardtextTemplateAdded() {},

    loadCardtextTemplatesRequest(state) {
      state.templatesListLoading = true
    },
    loadCardtextTemplatesSuccess(
      state,
      action: PayloadAction<CardtextContent[]>,
    ) {
      state.templatesList = action.payload
      state.templatesListLoading = false
    },
    loadCardtextTemplatesFailure(state) {
      state.templatesListLoading = false
      // Don't wipe already loaded templates on failure.
      // This prevents UI badges (like `listCardtext`) from disappearing forever
      // after a transient load error.
    },

    updateCardtextTemplateFavoriteInList(
      state,
      action: PayloadAction<{ id: string; favorite: boolean }>,
    ) {
      const { id, favorite } = action.payload
      if (!Array.isArray(state.templatesList)) return
      const idx = state.templatesList.findIndex((t) => t.id === id)
      if (idx !== -1)
        state.templatesList[idx] = { ...state.templatesList[idx], favorite }
    },

    updateCardtextTemplateTitleInList(
      state,
      action: PayloadAction<{ id: string; title: string }>,
    ) {
      const { id, title } = action.payload
      if (!Array.isArray(state.templatesList)) return
      const idx = state.templatesList.findIndex((t) => t.id === id)
      if (idx !== -1)
        state.templatesList[idx] = { ...state.templatesList[idx], title }
    },

    updateCardtextContentInList(
      state,
      action: PayloadAction<{
        id: string
        value: CardtextValue
        style: CardtextStyle
        plainText: string
        cardtextLines: number
      }>,
    ) {
      const { id, value, style, plainText, cardtextLines } = action.payload
      if (!Array.isArray(state.templatesList)) return
      const idx = state.templatesList.findIndex((t) => t.id === id)
      if (idx !== -1) {
        state.templatesList[idx] = {
          ...state.templatesList[idx],
          value,
          style,
          plainText,
          cardtextLines,
        }
      }
    },

    setDraftFocus(state, action: PayloadAction<boolean>) {
      state.isDraftFocus = action.payload
    },

    setDraftEngaged(state, action: PayloadAction<boolean>) {
      state.isDraftEngaged = action.payload
    },

    setCardtextViewEditMode(state, action: PayloadAction<boolean>) {
      state.isCardtextViewEditMode = action.payload
    },

  },
})

export const {
  setValue,
  setTextStyle,
  setAlign,
  setFontSizeStep,
  setTitle,
  setStatus,
  setFavorite,
  clearText,
  resetCardtextAssetToEmptyDraft,
  setCardtextId,
  setCardtextPresetData,
  setCardtextAppliedData,
  setDraftData,
  clearDraftData,
  restoreDraftData,
  restoreCardtextEditorSession,
  restoreCardtextSession,
  setCardtextListPanelOpen,
  setCardtextAddTemplateOpen,
  setCardtextEditTitleOpen,
  toggleCardtextListSortDirection,
  cardtextTemplateAdded,
  loadCardtextTemplatesRequest,
  loadCardtextTemplatesSuccess,
  loadCardtextTemplatesFailure,
  updateCardtextTemplateFavoriteInList,
  updateCardtextTemplateTitleInList,
  updateCardtextContentInList,
  setDraftFocus,
  setDraftEngaged,
  setCardtextViewEditMode,
} = cardtextSlice.actions

export default cardtextSlice.reducer
