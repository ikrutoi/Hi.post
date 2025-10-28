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

type PartialToolbarPayload = {
  [K in keyof ToolbarState]?: Partial<ToolbarState[K]>
}

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    updateToolbar(state, action: PayloadAction<PartialToolbarPayload>) {
      Object.entries(action.payload).forEach(([key, value]) => {
        if (
          key in state &&
          value &&
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          Object.assign(state[key as keyof ToolbarState], value)
        }
      })
    },
    resetToolbar() {
      return structuredClone(initialState)
    },
  },
})

export const { updateToolbar, resetToolbar } = toolbarSlice.actions
export default toolbarSlice.reducer
