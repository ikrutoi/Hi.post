import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  SectionState,
  ChoiceSection,
  ChoiceMemorySection,
  ButtonToolbar,
} from '../../domain/types'
import type { CardSectionName } from '@shared/types'

const initialState: SectionState = {
  activeSection: null,
  selectedSection: null,
  deleteSection: null,
  choiceSection: {
    source: null,
    nameSection: null,
  },
  choiceMemorySection: {},
  buttonToolbar: {
    firstBtn: '',
    secondBtn: '',
    section: '',
  },
  choiceSave: null,
  // choiceClip: null,
}

export const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<CardSectionName | null>) {
      state.activeSection = action.payload
    },
    setSelectedSection(state, action: PayloadAction<string | null>) {
      state.selectedSection = action.payload
    },
    setDeleteSection(state, action: PayloadAction<string | null>) {
      state.deleteSection = action.payload
    },
    setChoiceSection(state, action: PayloadAction<Partial<ChoiceSection>>) {
      state.choiceSection = {
        ...state.choiceSection,
        ...action.payload,
      }
    },
    setChoiceMemorySection(
      state,
      action: PayloadAction<Partial<ChoiceMemorySection>>
    ) {
      state.choiceMemorySection = {
        ...state.choiceMemorySection,
        ...action.payload,
      }
    },
    setButtonToolbar(state, action: PayloadAction<Partial<ButtonToolbar>>) {
      state.buttonToolbar = {
        ...state.buttonToolbar,
        ...action.payload,
      }
    },
    setChoiceSave(state, action: PayloadAction<string | null>) {
      state.choiceSave = action.payload
    },
    // setChoiceClip(state, action: PayloadAction<string | null>) {
    //   state.choiceClip = action.payload
    // },
  },
})

export const {
  setActiveSection,
  setSelectedSection,
  setDeleteSection,
  setChoiceSection,
  setChoiceMemorySection,
  setButtonToolbar,
  setChoiceSave,
  // setChoiceClip,
} = sectionSlice.actions

export default sectionSlice.reducer
