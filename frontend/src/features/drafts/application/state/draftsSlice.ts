import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Drafts, DraftPostcard } from '../../domain/draftsModel'

const initialState: Drafts = []

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setDrafts(state, action: PayloadAction<Drafts>) {
      return action.payload
    },
    addDraft(state, action: PayloadAction<DraftPostcard>) {
      state.push(action.payload)
    },
    clearDrafts() {
      return []
    },
  },
})

export const draftsActions = draftsSlice.actions
export default draftsSlice.reducer
