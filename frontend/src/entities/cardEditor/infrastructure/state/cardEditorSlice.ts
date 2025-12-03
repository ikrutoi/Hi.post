import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardSection } from '@shared/config/constants'
import type { CardEditorState } from '../../domain/types'
import { nanoid } from 'nanoid'

const initialState: CardEditorState = {
  id: nanoid(),
  cardphoto: { isComplete: false },
  cardtext: { isComplete: false },
  envelope: { isComplete: false },
  aroma: { isComplete: false },
  date: { isComplete: false },
  isCompleted: false,
}

export const cardEditorSlice = createSlice({
  name: 'cardEditor',
  initialState,
  reducers: {
    setSectionComplete(
      state,
      action: PayloadAction<{ section: CardSection; isComplete: boolean }>
    ) {
      const { section, isComplete } = action.payload
      state[section].isComplete = isComplete

      const allComplete =
        state.cardphoto.isComplete &&
        state.cardtext.isComplete &&
        state.envelope.isComplete &&
        state.aroma.isComplete &&
        state.date.isComplete

      state.isCompleted = allComplete
    },

    resetEditor(state) {
      state.id = nanoid()
      state.cardphoto.isComplete = false
      state.cardtext.isComplete = false
      state.envelope.isComplete = false
      state.aroma.isComplete = false
      state.date.isComplete = false
      state.isCompleted = false
    },

    clearSection(state, action: PayloadAction<CardSection>) {
      const section = action.payload
      state[section].isComplete = false

      const allComplete =
        state.cardphoto.isComplete &&
        state.cardtext.isComplete &&
        state.envelope.isComplete &&
        state.aroma.isComplete &&
        state.date.isComplete

      state.isCompleted = allComplete
    },
  },
})

export const { setSectionComplete, resetEditor, clearSection } =
  cardEditorSlice.actions
export default cardEditorSlice.reducer
