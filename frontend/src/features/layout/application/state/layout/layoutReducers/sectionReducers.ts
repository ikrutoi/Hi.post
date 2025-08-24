import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  SectionChoice,
  ActiveSections,
} from '../../../../domain/model/layoutTypes'

export const addChoiceSection = (
  state: DraftLayoutState,
  action: PayloadAction<Partial<SectionChoice>>
) => {
  state.choiceSection = { ...state.choiceSection, ...action.payload }
}

export const setSelectedSection = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.selectedSection = action.payload
}

export const setDeleteSection = (
  state: DraftLayoutState,
  action: PayloadAction<string | null>
) => {
  state.deleteSection = action.payload
}

export const setActiveSections = (
  state: DraftLayoutState,
  action: PayloadAction<Partial<ActiveSections>>
) => {
  state.activeSections = { ...state.activeSections, ...action.payload }
}
