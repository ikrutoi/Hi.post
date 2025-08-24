import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SectionChoice = { source: string | null; nameSection: string | null }

interface SectionState {
  choiceSection: SectionChoice
  selectedSection: string | null
  deleteSection: string | null
}

const initialState: SectionState = {
  choiceSection: { source: null, nameSection: null },
  selectedSection: null,
  deleteSection: null,
}

const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    setChoiceSection: (
      state,
      action: PayloadAction<Partial<SectionChoice>>
    ) => {
      state.choiceSection = { ...state.choiceSection, ...action.payload }
    },
    setSelectedSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSection = action.payload
    },
    setDeleteSection: (state, action: PayloadAction<string | null>) => {
      state.deleteSection = action.payload
    },
  },
})

export const { setChoiceSection, setSelectedSection, setDeleteSection } =
  sectionSlice.actions
export const sectionReducer = sectionSlice.reducer
export type { SectionState }
