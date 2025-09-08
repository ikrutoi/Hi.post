import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DraftLayoutState, SectionChoice } from '../../domain/layoutTypes'

const initialState: DraftLayoutState['section'] = {
  selectedSection: null,
  choiceSection: {
    source: null,
    nameSection: null,
  },
  deleteSection: null,
  activeSections: {},
}

export const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    setSelectedSection(state, action: PayloadAction<string | null>) {
      state.selectedSection = action.payload
    },

    setDeleteSection(state, action: PayloadAction<string | null>) {
      state.deleteSection = action.payload
    },

    setChoiceSection(state, action: PayloadAction<Partial<SectionChoice>>) {
      state.choiceSection = {
        ...state.choiceSection,
        ...action.payload,
      }
    },

    setActiveSections(state, action: PayloadAction<Record<string, boolean>>) {
      state.activeSections = {
        ...state.activeSections,
        ...action.payload,
      }
    },
  },
})

export const sectionActions = sectionSlice.actions
export default sectionSlice.reducer
