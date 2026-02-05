import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SectionEditorMenuKey } from '@toolbar/domain/types'

interface SectionEditorMenuState {
  activeSection: SectionEditorMenuKey | null
}

const initialState: SectionEditorMenuState = {
  activeSection: null,
}

export const sectionEditorMenuSlice = createSlice({
  name: 'sectionEditorMenu',
  initialState,
  reducers: {
    setActiveSection(state, action: PayloadAction<SectionEditorMenuKey>) {
      console.log('SET_ACTIVE_SECTION')
      if (state.activeSection !== action.payload) {
        state.activeSection = action.payload
      }
    },

    restoreEditorSession(state, action: PayloadAction<SectionEditorMenuKey>) {
      state.activeSection = action.payload
    },

    resetActiveSection(state) {
      state.activeSection = null
    },
  },
})

export const { setActiveSection, restoreEditorSession, resetActiveSection } =
  sectionEditorMenuSlice.actions
export default sectionEditorMenuSlice.reducer
