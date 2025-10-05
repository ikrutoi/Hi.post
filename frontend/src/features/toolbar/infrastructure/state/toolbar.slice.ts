import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  initialCardphotoToolbarState,
  initialCardtextToolbarState,
  initialEnvelopeToolbarState,
} from '../../domain/types'
import type { ToolbarState } from '../../domain/types'

const initialState: ToolbarState = {
  cardphoto: initialCardphotoToolbarState,
  cardtext: initialCardtextToolbarState,
  envelope: initialEnvelopeToolbarState,
}

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    updateToolbar(state, action: PayloadAction<Partial<ToolbarState>>) {
      if (action.payload.cardphoto) {
        Object.assign(state.cardphoto, action.payload.cardphoto)
      }
      if (action.payload.cardtext) {
        Object.assign(state.cardtext, action.payload.cardtext)
      }
      if (action.payload.envelope) {
        Object.assign(state.envelope, action.payload.envelope)
      }
    },
    resetToolbar() {
      return structuredClone(initialState)
    },
  },
})

export const { updateToolbar, resetToolbar } = toolbarSlice.actions
export default toolbarSlice.reducer
