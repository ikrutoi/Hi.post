import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DraftLayoutState } from '../../domain/types/layout.types'

const initialState: DraftLayoutState['activeSection'] = {
  sections: {},
}

export const activeSectionSlice = createSlice({
  name: 'activeSection',
  initialState,
  reducers: {
    setActiveSections(state, action: PayloadAction<Record<string, boolean>>) {
      state.sections = {
        ...state.sections,
        ...action.payload,
      }
    },
  },
})

export const { setActiveSections } = activeSectionSlice.actions
export default activeSectionSlice.reducer
