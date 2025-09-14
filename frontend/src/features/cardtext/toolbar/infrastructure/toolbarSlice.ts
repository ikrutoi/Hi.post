import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ToolbarState } from '../domain'

const initialState: ToolbarState = {
  italic: 'hover',
  fontSize: true,
  color: true,
  left: 'hover',
  center: true,
  right: true,
  justify: true,
  save: false,
  delete: false,
  clip: false,
}

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    updateToolbar: (state, action: PayloadAction<Partial<ToolbarState>>) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { updateToolbar } = toolbarSlice.actions
export default toolbarSlice.reducer
