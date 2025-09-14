import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  ChoiceSection,
  ChoiceClip,
} from 'shared-legacy/layoutLegacy/model/layoutTypes'

interface LayoutSelectionState {
  choiceSection: ChoiceSection
  choiceClip: ChoiceClip
  selectedSection: string | null
  deleteSection: string | null
}

const initialState: LayoutSelectionState = {
  choiceSection: { source: null, nameSection: null },
  choiceClip: null,
  selectedSection: null,
  deleteSection: null,
}

const layoutSelectionSlice = createSlice({
  name: 'layoutSelection',
  initialState,
  reducers: {
    setChoiceSection(state, action: PayloadAction<Partial<ChoiceSection>>) {
      state.choiceSection = { ...state.choiceSection, ...action.payload }
    },
    setChoiceClip(state, action: PayloadAction<ChoiceClip>) {
      state.choiceClip = action.payload
    },
    setSelectedSection(state, action: PayloadAction<string | null>) {
      state.selectedSection = action.payload
    },
    setDeleteSection(state, action: PayloadAction<string | null>) {
      state.deleteSection = action.payload
    },
  },
})

export const {
  setChoiceSection,
  setChoiceClip,
  setSelectedSection,
  setDeleteSection,
} = layoutSelectionSlice.actions
export default layoutSelectionSlice.reducer
