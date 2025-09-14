import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ToolbarState } from '@shared/types'

const initialState: ToolbarState = {
  download: true,
  save: false,
  delete: false,
  turn: true,
  maximize: false,
  crop: true,
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
