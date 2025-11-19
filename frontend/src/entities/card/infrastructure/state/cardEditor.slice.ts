import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CARD_TEMPLATE_SECTIONS } from '@entities/card/domain/types'
import type { WritableDraft } from 'immer'
import type {
  CardEditor,
  CardEditorDataMap,
  CardSection,
  Completion,
  CardTemplateSection,
} from '@entities/card/domain/types'

const initialCompletion = { isComplete: false } as const

const initialState: CardEditor = {
  id: null,
  templates: {},
  cardphoto: initialCompletion,
  cardtext: initialCompletion,
  envelope: initialCompletion,
  aroma: initialCompletion,
  date: initialCompletion,
}

export const cardEditorSlice = createSlice({
  name: 'cardEditor',
  initialState,
  reducers: {
    setSectionComplete<K extends keyof CardEditorDataMap>(
      state: WritableDraft<CardEditor>,
      action: PayloadAction<{
        section: K
        data: CardEditorDataMap[K]
      }>
    ) {
      const { section, data } = action.payload

      const completion: Completion<CardEditorDataMap[K]> = {
        isComplete: true,
        data,
      }

      state[section] = completion as WritableDraft<CardEditor>[K]
    },
    resetSection(state, action: PayloadAction<CardSection>) {
      const section = action.payload
      state[section] = initialCompletion

      if (CARD_TEMPLATE_SECTIONS.includes(section as CardTemplateSection)) {
        delete state.templates[section as CardTemplateSection]
      }
    },
    setEditorId(state, action: PayloadAction<string>) {
      state.id = action.payload
    },
    setTemplateId<K extends CardTemplateSection>(
      state: WritableDraft<CardEditor>,
      action: PayloadAction<{ section: K; templateId: string }>
    ) {
      state.templates[action.payload.section] = action.payload.templateId
    },
    resetEditor(state) {
      Object.assign(state, initialState)
    },
  },
})

export const {
  setSectionComplete,
  resetSection,
  setEditorId,
  setTemplateId,
  resetEditor,
} = cardEditorSlice.actions

export default cardEditorSlice.reducer
